#!/usr/bin/env python3
"""
Theme Park Crowd Calendar Planner
Reads settings from config.ini and finds the best (least crowded) days to visit.

First-time setup:
    python day_finder.py --setup        # create a config.ini interactively
    python day_finder.py --list-parks   # browse available parks and their IDs
    python day_finder.py --search "alton towers"

Then just run:
    python day_finder.py
"""

import argparse
import configparser
import json
import os
import re
import sys
from datetime import date, timedelta
from urllib.request import urlopen, Request
from urllib.error import URLError

BASE_URL = "https://queue-times.com"
PARKS_API = f"{BASE_URL}/parks.json"
CONFIG_FILE = "config.ini"

WEEKDAY_MAP = {
    "mon": 0,
    "monday": 0,
    "tue": 1,
    "tuesday": 1,
    "wed": 2,
    "wednesday": 2,
    "thu": 3,
    "thursday": 3,
    "fri": 4,
    "friday": 4,
    "sat": 5,
    "saturday": 5,
    "sun": 6,
    "sunday": 6,
}
WEEKDAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

CROWD_LABELS = [
    (30, "🟢 Very quiet"),
    (50, "🟡 Quiet"),
    (70, "🟠 Moderate"),
    (85, "🔴 Busy"),
    (101, "⛔ Very busy"),
]

DEFAULT_CONFIG = """\
[park]
# The numeric ID of the park to check.
# Run:  python theme_park_planner.py --search "park name"  to find the ID.
park_id = 2

[dates]
# How many days ahead to search (from today).
# Ignored if start_date / end_date are set below.
days_ahead = 30

# Optionally pin a specific date range (YYYY-MM-DD).
# Leave blank to use days_ahead from today.
start_date =
end_date   =

[filters]
# Days of the week to include. Comma-separated: mon, tue, wed, thu, fri, sat, sun
# Leave blank (or use all) to include every day.
weekdays = mon, tue, wed, thu, fri, sat, sun

# Only show days where crowd % is at or below this threshold (1–100).
max_crowd_pct = 100

[output]
# How many of the best days to display.
top_n = 10
"""


# ── helpers ───────────────────────────────────────────────────────────────────


def crowd_label(pct):
    for threshold, label in CROWD_LABELS:
        if pct < threshold:
            return label
    return "❓ Unknown"


def fetch(url):
    req = Request(url, headers={"User-Agent": "DayFinder/1.0"})
    with urlopen(req, timeout=10) as resp:
        return resp.read().decode("utf-8")


# ── park search / listing ─────────────────────────────────────────────────────


def list_parks():
    print("Fetching park list...\n")
    data = json.loads(fetch(PARKS_API))
    print(f"{'ID':<6} {'Park':<45} {'Country':<22} {'Group'}")
    print("-" * 105)
    for group in data:
        for park in group.get("parks", []):
            print(
                f"{park['id']:<6} {park['name']:<45} {park.get('country', ''):<22} {group['name']}"
            )


def search_parks(query):
    data = json.loads(fetch(PARKS_API))
    q = query.lower()
    results = []
    for group in data:
        for park in group.get("parks", []):
            if q in park["name"].lower() or q in park.get("country", "").lower():
                results.append({**park, "group": group["name"]})
    return results


# ── calendar scraping ─────────────────────────────────────────────────────────


def scrape_calendar_month(park_id, year, month):
    url = f"{BASE_URL}/parks/{park_id}/calendar/{year}/{month:02d}"
    html = fetch(url)

    name_match = re.search(
        r"<h1[^>]*>(.*?) crowd calendar\s*</h1>", html, re.IGNORECASE | re.DOTALL
    )
    park_name = name_match.group(1).strip() if name_match else f"Park {park_id}"

    open_pattern = re.compile(
        r"/parks/\d+/calendar/(\d{4})/(\d{2})/(\d{2}).*?"
        r"(\d+)%(\*?).*?(\d{2}:\d{2}-\d{2}:\d{2})",
        re.DOTALL,
    )
    closed_pattern = re.compile(
        r"/parks/\d+/calendar/(\d{4})/(\d{2})/(\d{2}).*?Closed",
        re.DOTALL,
    )

    days, seen = [], set()

    for m in open_pattern.finditer(html):
        y, mo, d = int(m.group(1)), int(m.group(2)), int(m.group(3))
        key = (y, mo, d)
        if key in seen:
            continue
        seen.add(key)
        dt = date(y, mo, d)
        days.append(
            {
                "date": dt,
                "crowd_pct": int(m.group(4)),
                "predicted": m.group(5) == "*",
                "hours": m.group(6),
                "closed": False,
                "weekday": dt.weekday(),
                "park_name": park_name,
            }
        )

    for m in closed_pattern.finditer(html):
        y, mo, d = int(m.group(1)), int(m.group(2)), int(m.group(3))
        key = (y, mo, d)
        if key in seen:
            continue
        seen.add(key)
        dt = date(y, mo, d)
        days.append(
            {
                "date": dt,
                "crowd_pct": None,
                "predicted": False,
                "hours": None,
                "closed": True,
                "weekday": dt.weekday(),
                "park_name": park_name,
            }
        )

    return days, park_name


def get_days_in_range(park_id, start_date, end_date):
    all_days, park_name = [], None

    months_needed = set()
    cur = start_date.replace(day=1)
    while cur <= end_date:
        months_needed.add((cur.year, cur.month))
        cur = (
            cur.replace(month=cur.month + 1)
            if cur.month < 12
            else cur.replace(year=cur.year + 1, month=1)
        )

    for year, month in sorted(months_needed):
        try:
            print(f"  Fetching {date(year, month, 1).strftime('%B %Y')}...")
            days, park_name = scrape_calendar_month(park_id, year, month)
            all_days.extend(days)
        except URLError as e:
            print(
                f"  Warning: could not fetch {year}/{month:02d}: {e}", file=sys.stderr
            )

    filtered = [
        d for d in all_days if start_date <= d["date"] <= end_date and not d["closed"]
    ]
    filtered.sort(key=lambda x: x["crowd_pct"])
    return filtered, park_name


# ── output ────────────────────────────────────────────────────────────────────


def print_results(days, top_n, park_name):
    if not days:
        print("No open days found matching your filters.")
        return

    shown = days[:top_n]

    print(f"\n{'=' * 65}")
    print(f"  Best days to visit: {park_name}")
    print(f"{'=' * 65}")
    print(f"  {'Date':<14} {'Day':<5} {'Crowd':<7} {'Status':<18} Hours")
    print(f"  {'-' * 60}")

    for d in shown:
        dt_str = d["date"].strftime("%d %b %Y")
        day_name = WEEKDAY_NAMES[d["weekday"]]
        pct_str = f"{d['crowd_pct']}%{'*' if d['predicted'] else ' '}"
        status = crowd_label(d["crowd_pct"])
        hours = d["hours"] or ""
        print(f"  {dt_str:<14} {day_name:<5} {pct_str:<7} {status:<18} {hours}")

    print(f"\n  * = predicted crowd level")
    print(f"  Showing top {len(shown)} of {len(days)} open days (sorted by crowd %)\n")


# ── config ────────────────────────────────────────────────────────────────────


def create_config():
    if os.path.exists(CONFIG_FILE):
        overwrite = (
            input(f"{CONFIG_FILE} already exists. Overwrite? [y/N] ").strip().lower()
        )
        if overwrite != "y":
            print("Cancelled.")
            return

    with open(CONFIG_FILE, "w") as f:
        f.write(DEFAULT_CONFIG)

    print(f"\nCreated {CONFIG_FILE}")
    print("  Edit it to set your park ID and preferences, then run the script again.")
    print(
        f'  Tip: run  python {os.path.basename(__file__)} --search "park name"  to find park IDs.\n'
    )


def load_config():
    if not os.path.exists(CONFIG_FILE):
        print(f"No {CONFIG_FILE} found.")
        print(f"Run:  python {os.path.basename(__file__)} --setup  to create one.\n")
        sys.exit(1)

    cfg = configparser.ConfigParser(inline_comment_prefixes="#")
    cfg.read(CONFIG_FILE)

    def get(section, key, fallback=""):
        return cfg.get(section, key, fallback=fallback).strip()

    # park_id
    raw_id = get("park", "park_id")
    if not raw_id or not raw_id.isdigit():
        print(f"Error: [park] park_id must be a number in {CONFIG_FILE}.")
        sys.exit(1)
    park_id = int(raw_id)

    # date range
    start_raw = get("dates", "start_date")
    end_raw = get("dates", "end_date")
    days_raw = get("dates", "days_ahead", "30")
    today = date.today()

    if start_raw:
        try:
            start_date = date.fromisoformat(start_raw)
        except ValueError:
            print(f"Error: start_date '{start_raw}' is not a valid YYYY-MM-DD date.")
            sys.exit(1)
        if end_raw:
            try:
                end_date = date.fromisoformat(end_raw)
            except ValueError:
                print(f"Error: end_date '{end_raw}' is not a valid YYYY-MM-DD date.")
                sys.exit(1)
        else:
            days_ahead = int(days_raw) if days_raw.isdigit() else 30
            end_date = start_date + timedelta(days=days_ahead - 1)
    else:
        days_ahead = int(days_raw) if days_raw.isdigit() else 30
        start_date = today
        end_date = today + timedelta(days=days_ahead - 1)

    # weekdays
    weekdays_raw = get("filters", "weekdays", "")
    if not weekdays_raw or weekdays_raw.lower() == "all":
        allowed_weekdays = None
    else:
        allowed_weekdays = set()
        for w in re.split(r"[\s,]+", weekdays_raw.lower()):
            w = w.strip()
            if not w:
                continue
            if w not in WEEKDAY_MAP:
                print(
                    f"Error: unknown weekday '{w}' in config. Use mon/tue/wed/thu/fri/sat/sun."
                )
                sys.exit(1)
            allowed_weekdays.add(WEEKDAY_MAP[w])

    # max crowd
    max_crowd_raw = get("filters", "max_crowd_pct", "100")
    max_crowd = int(max_crowd_raw) if max_crowd_raw.isdigit() else 100

    # top n
    top_n_raw = get("output", "top_n", "10")
    top_n = int(top_n_raw) if top_n_raw.isdigit() else 10

    return {
        "park_id": park_id,
        "start_date": start_date,
        "end_date": end_date,
        "allowed_weekdays": allowed_weekdays,
        "max_crowd": max_crowd,
        "top_n": top_n,
    }


# ── entry point ───────────────────────────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser(
        description="Find the least crowded days to visit a theme park.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=f"""
Workflow:
  1. python %(prog)s --setup            create {CONFIG_FILE}
  2. python %(prog)s --search "name"    find your park's ID
  3. Edit {CONFIG_FILE} with the park ID and your preferences
  4. python %(prog)s                    run the planner

Other helpers:
  python %(prog)s --list-parks          browse all available parks
        """,
    )
    parser.add_argument(
        "--setup", action="store_true", help=f"Create a default {CONFIG_FILE}"
    )
    parser.add_argument(
        "--list-parks", action="store_true", help="List all parks and their IDs"
    )
    parser.add_argument("--search", metavar="NAME", help="Search for a park by name")
    args = parser.parse_args()

    if args.setup:
        create_config()
        return

    if args.list_parks:
        list_parks()
        return

    if args.search:
        results = search_parks(args.search)
        if not results:
            print(f"No parks found matching '{args.search}'.")
        else:
            print(f"\nParks matching '{args.search}':\n")
            print(f"{'ID':<6} {'Park':<45} {'Country'}")
            print("-" * 70)
            for p in results:
                print(f"{p['id']:<6} {p['name']:<45} {p.get('country', '')}")
            print(f"\nAdd the ID to the [park] section of {CONFIG_FILE}.\n")
        return

    # Normal run — load config and fetch data
    settings = load_config()

    print(f"\nSettings loaded from {CONFIG_FILE}")
    print(f"  Park ID   : {settings['park_id']}")
    print(f"  Date range: {settings['start_date']} to {settings['end_date']}")
    if settings["allowed_weekdays"] is not None:
        names = [WEEKDAY_NAMES[i] for i in sorted(settings["allowed_weekdays"])]
        print(f"  Weekdays  : {', '.join(names)}")
    else:
        print(f"  Weekdays  : all")
    print(f"  Max crowd : {settings['max_crowd']}%")
    print(f"  Show top  : {settings['top_n']} days")
    print()

    try:
        days, park_name = get_days_in_range(
            settings["park_id"], settings["start_date"], settings["end_date"]
        )
    except URLError as e:
        print(f"Error fetching data: {e}")
        sys.exit(1)

    if settings["allowed_weekdays"] is not None:
        days = [d for d in days if d["weekday"] in settings["allowed_weekdays"]]
    if settings["max_crowd"] < 100:
        days = [
            d
            for d in days
            if d["crowd_pct"] is not None and d["crowd_pct"] <= settings["max_crowd"]
        ]

    print_results(days, settings["top_n"], park_name or f"Park {settings['park_id']}")


if __name__ == "__main__":
    main()
