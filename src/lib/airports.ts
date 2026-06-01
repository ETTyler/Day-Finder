export interface Airport {
  iata: string
  name: string
  lat: number
  lon: number
}

export const MAJOR_AIRPORTS: Airport[] = [
  // UK
  { iata: 'LHR', name: 'London Heathrow',          lat: 51.4700,  lon: -0.4543  },
  { iata: 'LGW', name: 'London Gatwick',            lat: 51.1537,  lon: -0.1821  },
  { iata: 'STN', name: 'London Stansted',           lat: 51.8860,  lon: 0.2389   },
  { iata: 'MAN', name: 'Manchester',                lat: 53.3537,  lon: -2.2750  },
  { iata: 'EDI', name: 'Edinburgh',                 lat: 55.9500,  lon: -3.3725  },
  { iata: 'BHX', name: 'Birmingham',                lat: 52.4539,  lon: -1.7480  },
  { iata: 'BRS', name: 'Bristol',                   lat: 51.3827,  lon: -2.7191  },
  { iata: 'GLA', name: 'Glasgow',                   lat: 55.8719,  lon: -4.4330  },
  // Ireland
  { iata: 'DUB', name: 'Dublin',                    lat: 53.4213,  lon: -6.2700  },
  // France
  { iata: 'CDG', name: 'Paris Charles de Gaulle',   lat: 49.0097,  lon: 2.5479   },
  { iata: 'ORY', name: 'Paris Orly',                lat: 48.7253,  lon: 2.3594   },
  { iata: 'NCE', name: 'Nice',                      lat: 43.6584,  lon: 7.2159   },
  { iata: 'LYS', name: 'Lyon',                      lat: 45.7263,  lon: 5.0908   },
  { iata: 'MRS', name: 'Marseille',                 lat: 43.4393,  lon: 5.2214   },
  { iata: 'TLS', name: 'Toulouse',                  lat: 43.6293,  lon: 1.3638   },
  { iata: 'BOD', name: 'Bordeaux',                  lat: 44.8283,  lon: -0.7156  },
  { iata: 'NTE', name: 'Nantes',                    lat: 47.1532,  lon: -1.6107  },
  { iata: 'SXB', name: 'Strasbourg',                lat: 48.5383,  lon: 7.6283   },
  // Netherlands
  { iata: 'AMS', name: 'Amsterdam Schiphol',        lat: 52.3086,  lon: 4.7639   },
  { iata: 'EIN', name: 'Eindhoven',                 lat: 51.4501,  lon: 5.3742   },
  // Belgium
  { iata: 'BRU', name: 'Brussels',                  lat: 50.9014,  lon: 4.4844   },
  { iata: 'CRL', name: 'Brussels South Charleroi',  lat: 50.4592,  lon: 4.4528   },
  // Germany
  { iata: 'FRA', name: 'Frankfurt',                 lat: 50.0379,  lon: 8.5622   },
  { iata: 'MUC', name: 'Munich',                    lat: 48.3538,  lon: 11.7861  },
  { iata: 'BER', name: 'Berlin Brandenburg',        lat: 52.3667,  lon: 13.5033  },
  { iata: 'DUS', name: 'Düsseldorf',                lat: 51.2895,  lon: 6.7668   },
  { iata: 'HAM', name: 'Hamburg',                   lat: 53.6304,  lon: 10.0063  },
  { iata: 'STR', name: 'Stuttgart',                 lat: 48.6899,  lon: 9.2220   },
  { iata: 'CGN', name: 'Cologne/Bonn',              lat: 50.8659,  lon: 7.1427   },
  { iata: 'NUE', name: 'Nuremberg',                 lat: 49.4987,  lon: 11.0669  },
  // Spain
  { iata: 'MAD', name: 'Madrid Barajas',            lat: 40.4936,  lon: -3.5668  },
  { iata: 'BCN', name: 'Barcelona El Prat',         lat: 41.2971,  lon: 2.0785   },
  { iata: 'VLC', name: 'Valencia',                  lat: 39.4893,  lon: -0.4816  },
  { iata: 'PMI', name: 'Palma de Mallorca',         lat: 39.5517,  lon: 2.7388   },
  { iata: 'SVQ', name: 'Seville',                   lat: 37.4180,  lon: -5.8931  },
  { iata: 'AGP', name: 'Málaga',                    lat: 36.6749,  lon: -4.4991  },
  { iata: 'BIO', name: 'Bilbao',                    lat: 43.3011,  lon: -2.9106  },
  // Italy
  { iata: 'FCO', name: 'Rome Fiumicino',            lat: 41.7999,  lon: 12.2462  },
  { iata: 'MXP', name: 'Milan Malpensa',            lat: 45.6306,  lon: 8.7281   },
  { iata: 'LIN', name: 'Milan Linate',              lat: 45.4455,  lon: 9.2773   },
  { iata: 'BGY', name: 'Milan Bergamo',             lat: 45.6739,  lon: 9.7042   },
  { iata: 'VCE', name: 'Venice',                    lat: 45.5053,  lon: 12.3519  },
  { iata: 'NAP', name: 'Naples',                    lat: 40.8860,  lon: 14.2908  },
  { iata: 'PSA', name: 'Pisa',                      lat: 43.6839,  lon: 10.3927  },
  { iata: 'BLQ', name: 'Bologna',                   lat: 44.5354,  lon: 11.2887  },
  // Switzerland
  { iata: 'ZRH', name: 'Zurich',                    lat: 47.4647,  lon: 8.5492   },
  { iata: 'GVA', name: 'Geneva',                    lat: 46.2380,  lon: 6.1089   },
  { iata: 'BSL', name: 'Basel-Mulhouse',            lat: 47.5896,  lon: 7.5299   },
  // Austria
  { iata: 'VIE', name: 'Vienna',                    lat: 48.1103,  lon: 16.5697  },
  { iata: 'SZG', name: 'Salzburg',                  lat: 47.7933,  lon: 13.0043  },
  { iata: 'INN', name: 'Innsbruck',                 lat: 47.2602,  lon: 11.3440  },
  // Scandinavia
  { iata: 'CPH', name: 'Copenhagen',                lat: 55.6180,  lon: 12.6560  },
  { iata: 'ARN', name: 'Stockholm Arlanda',         lat: 59.6519,  lon: 17.9186  },
  { iata: 'BMA', name: 'Stockholm Bromma',          lat: 59.3544,  lon: 17.9417  },
  { iata: 'OSL', name: 'Oslo Gardermoen',           lat: 60.1939,  lon: 11.1004  },
  { iata: 'HEL', name: 'Helsinki',                  lat: 60.3172,  lon: 24.9633  },
  { iata: 'GOT', name: 'Gothenburg',                lat: 57.6628,  lon: 12.2798  },
  { iata: 'BGO', name: 'Bergen',                    lat: 60.2934,  lon: 5.2181   },
  { iata: 'TRD', name: 'Trondheim',                 lat: 63.4578,  lon: 10.9239  },
  // Portugal
  { iata: 'LIS', name: 'Lisbon',                    lat: 38.7742,  lon: -9.1342  },
  { iata: 'OPO', name: 'Porto',                     lat: 41.2481,  lon: -8.6814  },
  { iata: 'FAO', name: 'Faro',                      lat: 37.0144,  lon: -7.9659  },
  // Greece
  { iata: 'ATH', name: 'Athens',                    lat: 37.9364,  lon: 23.9445  },
  { iata: 'SKG', name: 'Thessaloniki',              lat: 40.5197,  lon: 22.9709  },
  { iata: 'HER', name: 'Heraklion Crete',           lat: 35.3397,  lon: 25.1803  },
  // Poland
  { iata: 'WAW', name: 'Warsaw Chopin',             lat: 52.1657,  lon: 20.9671  },
  { iata: 'KRK', name: 'Kraków',                    lat: 50.0777,  lon: 19.7848  },
  { iata: 'GDN', name: 'Gdańsk',                    lat: 54.3776,  lon: 18.4662  },
  { iata: 'WRO', name: 'Wrocław',                   lat: 51.1027,  lon: 16.8858  },
  // Czech Republic
  { iata: 'PRG', name: 'Prague',                    lat: 50.1008,  lon: 14.2600  },
  // Hungary
  { iata: 'BUD', name: 'Budapest',                  lat: 47.4298,  lon: 19.2611  },
  // Romania
  { iata: 'OTP', name: 'Bucharest',                 lat: 44.5711,  lon: 26.0850  },
  // Croatia
  { iata: 'ZAG', name: 'Zagreb',                    lat: 45.7429,  lon: 16.0688  },
  { iata: 'SPU', name: 'Split',                     lat: 43.5389,  lon: 16.2980  },
  { iata: 'DBV', name: 'Dubrovnik',                 lat: 42.5614,  lon: 18.2682  },
  // Turkey
  { iata: 'IST', name: 'Istanbul',                  lat: 41.2753,  lon: 28.7519  },
  { iata: 'SAW', name: 'Istanbul Sabiha Gökçen',    lat: 40.8983,  lon: 29.3092  },
  { iata: 'AYT', name: 'Antalya',                   lat: 36.8987,  lon: 30.7992  },
  { iata: 'ADB', name: 'Izmir',                     lat: 38.2924,  lon: 27.1570  },
  // Middle East
  { iata: 'DXB', name: 'Dubai',                     lat: 25.2528,  lon: 55.3644  },
  { iata: 'DOH', name: 'Doha',                      lat: 25.2608,  lon: 51.6138  },
  { iata: 'AUH', name: 'Abu Dhabi',                 lat: 24.4428,  lon: 54.6511  },
  { iata: 'RUH', name: 'Riyadh',                    lat: 24.9578,  lon: 46.6988  },
  { iata: 'TLV', name: 'Tel Aviv',                  lat: 32.0114,  lon: 34.8867  },
  // US
  { iata: 'JFK', name: 'New York JFK',              lat: 40.6413,  lon: -73.7781 },
  { iata: 'EWR', name: 'New York Newark',           lat: 40.6895,  lon: -74.1745 },
  { iata: 'LGA', name: 'New York LaGuardia',        lat: 40.7773,  lon: -73.8726 },
  { iata: 'LAX', name: 'Los Angeles',               lat: 33.9425,  lon: -118.408 },
  { iata: 'SNA', name: 'Orange County',             lat: 33.6757,  lon: -117.868 },
  { iata: 'BUR', name: 'Burbank',                   lat: 34.2007,  lon: -118.359 },
  { iata: 'LGB', name: 'Long Beach',                lat: 33.8177,  lon: -118.152 },
  { iata: 'ORD', name: 'Chicago O\'Hare',           lat: 41.9742,  lon: -87.9073 },
  { iata: 'MDW', name: 'Chicago Midway',            lat: 41.7868,  lon: -87.7522 },
  { iata: 'ATL', name: 'Atlanta',                   lat: 33.6407,  lon: -84.4277 },
  { iata: 'DFW', name: 'Dallas Fort Worth',         lat: 32.8998,  lon: -97.0403 },
  { iata: 'DAL', name: 'Dallas Love Field',         lat: 32.8474,  lon: -96.8518 },
  { iata: 'MIA', name: 'Miami',                     lat: 25.7959,  lon: -80.2870 },
  { iata: 'FLL', name: 'Fort Lauderdale',           lat: 26.0726,  lon: -80.1527 },
  { iata: 'SFO', name: 'San Francisco',             lat: 37.6213,  lon: -122.379 },
  { iata: 'OAK', name: 'Oakland',                   lat: 37.7213,  lon: -122.221 },
  { iata: 'SJC', name: 'San Jose',                  lat: 37.3626,  lon: -121.929 },
  { iata: 'SEA', name: 'Seattle',                   lat: 47.4502,  lon: -122.308 },
  { iata: 'BOS', name: 'Boston',                    lat: 42.3656,  lon: -71.0096 },
  { iata: 'MCO', name: 'Orlando',                   lat: 28.4312,  lon: -81.3081 },
  { iata: 'TPA', name: 'Tampa',                     lat: 27.9755,  lon: -82.5332 },
  { iata: 'DEN', name: 'Denver',                    lat: 39.8561,  lon: -104.674 },
  { iata: 'PHX', name: 'Phoenix Sky Harbor',        lat: 33.4373,  lon: -112.008 },
  { iata: 'LAS', name: 'Las Vegas',                 lat: 36.0840,  lon: -115.153 },
  { iata: 'CLT', name: 'Charlotte',                 lat: 35.2144,  lon: -80.9473 },
  { iata: 'IAH', name: 'Houston Bush',              lat: 29.9902,  lon: -95.3368 },
  { iata: 'HOU', name: 'Houston Hobby',             lat: 29.6454,  lon: -95.2789 },
  { iata: 'MSP', name: 'Minneapolis',               lat: 44.8848,  lon: -93.2223 },
  { iata: 'DTW', name: 'Detroit',                   lat: 42.2124,  lon: -83.3534 },
  { iata: 'PHL', name: 'Philadelphia',              lat: 39.8729,  lon: -75.2437 },
  { iata: 'IAD', name: 'Washington Dulles',         lat: 38.9531,  lon: -77.4565 },
  { iata: 'DCA', name: 'Washington Reagan',         lat: 38.8521,  lon: -77.0377 },
  { iata: 'BWI', name: 'Baltimore',                 lat: 39.1754,  lon: -76.6683 },
  { iata: 'SLC', name: 'Salt Lake City',            lat: 40.7884,  lon: -111.978 },
  { iata: 'PDX', name: 'Portland',                  lat: 45.5887,  lon: -122.593 },
  { iata: 'SAN', name: 'San Diego',                 lat: 32.7336,  lon: -117.190 },
  { iata: 'AUS', name: 'Austin',                    lat: 30.1975,  lon: -97.6664 },
  { iata: 'MSY', name: 'New Orleans',               lat: 29.9934,  lon: -90.2580 },
  { iata: 'RDU', name: 'Raleigh-Durham',            lat: 35.8776,  lon: -78.7875 },
  { iata: 'BNA', name: 'Nashville',                 lat: 36.1245,  lon: -86.6782 },
  { iata: 'STL', name: 'St. Louis',                 lat: 38.7487,  lon: -90.3700 },
  { iata: 'CMH', name: 'Columbus',                  lat: 39.9980,  lon: -82.8919 },
  { iata: 'PIT', name: 'Pittsburgh',                lat: 40.4915,  lon: -80.2329 },
  { iata: 'CLE', name: 'Cleveland',                 lat: 41.4117,  lon: -81.8498 },
  { iata: 'MKE', name: 'Milwaukee',                 lat: 42.9472,  lon: -87.8966 },
  { iata: 'IND', name: 'Indianapolis',              lat: 39.7173,  lon: -86.2944 },
  { iata: 'ORL', name: 'Orlando Executive',         lat: 28.5455,  lon: -81.3329 },
  // Canada
  { iata: 'YYZ', name: 'Toronto Pearson',           lat: 43.6777,  lon: -79.6248 },
  { iata: 'YYC', name: 'Calgary',                   lat: 51.1315,  lon: -114.010 },
  { iata: 'YVR', name: 'Vancouver',                 lat: 49.1967,  lon: -123.184 },
  { iata: 'YUL', name: 'Montréal',                  lat: 45.4706,  lon: -73.7408 },
  { iata: 'YOW', name: 'Ottawa',                    lat: 45.3225,  lon: -75.6692 },
  { iata: 'YEG', name: 'Edmonton',                  lat: 53.3097,  lon: -113.580 },
  // Japan
  { iata: 'NRT', name: 'Tokyo Narita',              lat: 35.7647,  lon: 140.3864 },
  { iata: 'HND', name: 'Tokyo Haneda',              lat: 35.5494,  lon: 139.7798 },
  { iata: 'KIX', name: 'Osaka Kansai',              lat: 34.4347,  lon: 135.2440 },
  { iata: 'ITM', name: 'Osaka Itami',               lat: 34.7855,  lon: 135.4380 },
  { iata: 'CTS', name: 'Sapporo',                   lat: 42.7752,  lon: 141.6920 },
  { iata: 'FUK', name: 'Fukuoka',                   lat: 33.5857,  lon: 130.4511 },
  { iata: 'OKA', name: 'Naha Okinawa',              lat: 26.1958,  lon: 127.6461 },
  // South Korea
  { iata: 'ICN', name: 'Seoul Incheon',             lat: 37.4691,  lon: 126.4505 },
  { iata: 'GMP', name: 'Seoul Gimpo',               lat: 37.5583,  lon: 126.7907 },
  { iata: 'PUS', name: 'Busan',                     lat: 35.1795,  lon: 128.9382 },
  // China
  { iata: 'PEK', name: 'Beijing Capital',           lat: 40.0801,  lon: 116.5846 },
  { iata: 'PKX', name: 'Beijing Daxing',            lat: 39.5093,  lon: 116.4104 },
  { iata: 'PVG', name: 'Shanghai Pudong',           lat: 31.1443,  lon: 121.8083 },
  { iata: 'SHA', name: 'Shanghai Hongqiao',         lat: 31.1979,  lon: 121.3363 },
  { iata: 'CAN', name: 'Guangzhou',                 lat: 23.3924,  lon: 113.2990 },
  { iata: 'SZX', name: 'Shenzhen',                  lat: 22.6395,  lon: 113.8108 },
  { iata: 'CTU', name: 'Chengdu',                   lat: 30.5785,  lon: 103.9470 },
  // Hong Kong
  { iata: 'HKG', name: 'Hong Kong',                 lat: 22.3080,  lon: 113.9185 },
  // Southeast Asia
  { iata: 'BKK', name: 'Bangkok Suvarnabhumi',      lat: 13.6900,  lon: 100.7501 },
  { iata: 'DMK', name: 'Bangkok Don Mueang',        lat: 13.9126,  lon: 100.6068 },
  { iata: 'SIN', name: 'Singapore Changi',          lat: 1.3644,   lon: 103.9915 },
  { iata: 'KUL', name: 'Kuala Lumpur',              lat: 2.7456,   lon: 101.7099 },
  { iata: 'CGK', name: 'Jakarta',                   lat: -6.1256,  lon: 106.6559 },
  { iata: 'DPS', name: 'Bali Denpasar',             lat: -8.7482,  lon: 115.1670 },
  { iata: 'HAN', name: 'Hanoi',                     lat: 21.2212,  lon: 105.8072 },
  { iata: 'SGN', name: 'Ho Chi Minh City',          lat: 10.8188,  lon: 106.6520 },
  { iata: 'MNL', name: 'Manila',                    lat: 14.5086,  lon: 121.0197 },
  { iata: 'CNX', name: 'Chiang Mai',                lat: 18.7668,  lon: 98.9628  },
  { iata: 'HKT', name: 'Phuket',                    lat: 8.1132,   lon: 98.3169  },
  // Australia / New Zealand
  { iata: 'SYD', name: 'Sydney',                    lat: -33.9399, lon: 151.1753 },
  { iata: 'MEL', name: 'Melbourne',                 lat: -37.6690, lon: 144.8410 },
  { iata: 'BNE', name: 'Brisbane',                  lat: -27.3842, lon: 153.1175 },
  { iata: 'PER', name: 'Perth',                     lat: -31.9403, lon: 115.9670 },
  { iata: 'ADL', name: 'Adelaide',                  lat: -34.9450, lon: 138.5300 },
  { iata: 'CBR', name: 'Canberra',                  lat: -35.3069, lon: 149.1950 },
  { iata: 'AKL', name: 'Auckland',                  lat: -37.0082, lon: 174.7850 },
  { iata: 'WLG', name: 'Wellington',                lat: -41.3272, lon: 174.8052 },
  { iata: 'CHC', name: 'Christchurch',              lat: -43.4894, lon: 172.5320 },
  // Africa
  { iata: 'JNB', name: 'Johannesburg',              lat: -26.1392, lon: 28.2460  },
  { iata: 'CPT', name: 'Cape Town',                 lat: -33.9715, lon: 18.6021  },
  { iata: 'CAI', name: 'Cairo',                     lat: 30.1219,  lon: 31.4056  },
  { iata: 'CMN', name: 'Casablanca',                lat: 33.3675,  lon: -7.5900  },
  { iata: 'NBO', name: 'Nairobi',                   lat: -1.3192,  lon: 36.9275  },
  { iata: 'LOS', name: 'Lagos',                     lat: 6.5774,   lon: 3.3214   },
  // South America
  { iata: 'GRU', name: 'São Paulo Guarulhos',       lat: -23.4356, lon: -46.4731 },
  { iata: 'GIG', name: 'Rio de Janeiro',            lat: -22.8099, lon: -43.2506 },
  { iata: 'EZE', name: 'Buenos Aires',              lat: -34.8222, lon: -58.5358 },
  { iata: 'LIM', name: 'Lima',                      lat: -12.0219, lon: -77.1143 },
  { iata: 'BOG', name: 'Bogotá',                    lat: 4.7016,   lon: -74.1469 },
  { iata: 'SCL', name: 'Santiago',                  lat: -33.3928, lon: -70.7856 },
  { iata: 'MVD', name: 'Montevideo',                lat: -34.8384, lon: -56.0308 },
  // Mexico
  { iata: 'MEX', name: 'Mexico City',               lat: 19.4363,  lon: -99.0721 },
  { iata: 'CUN', name: 'Cancún',                    lat: 21.0365,  lon: -86.8770 },
  { iata: 'GDL', name: 'Guadalajara',               lat: 20.5218,  lon: -103.311 },
  { iata: 'MTY', name: 'Monterrey',                 lat: 25.7749,  lon: -100.107 },
  { iata: 'MID', name: 'Mérida',                    lat: 20.9370,  lon: -89.6576 },
  // Caribbean / Central America
  { iata: 'MBJ', name: 'Montego Bay',               lat: 18.5037,  lon: -77.9134 },
  { iata: 'SDQ', name: 'Santo Domingo',             lat: 18.4297,  lon: -69.6688 },
  { iata: 'SJO', name: 'San José Costa Rica',       lat: 9.9939,   lon: -84.2088 },
  // India
  { iata: 'DEL', name: 'Delhi',                     lat: 28.5665,  lon: 77.1031  },
  { iata: 'BOM', name: 'Mumbai',                    lat: 19.0887,  lon: 72.8679  },
  { iata: 'BLR', name: 'Bangalore',                 lat: 13.1986,  lon: 77.7066  },
  { iata: 'MAA', name: 'Chennai',                   lat: 12.9900,  lon: 80.1693  },
  { iata: 'CCU', name: 'Kolkata',                   lat: 22.6547,  lon: 88.4467  },
  { iata: 'HYD', name: 'Hyderabad',                 lat: 17.2403,  lon: 78.4294  },
  { iata: 'COK', name: 'Kochi',                     lat: 10.1520,  lon: 76.4019  },
]

export function findNearestAirport(lat: number, lon: number): Airport {
  let nearest = MAJOR_AIRPORTS[0]
  let minDist = Infinity
  for (const airport of MAJOR_AIRPORTS) {
    const dLat = airport.lat - lat
    const dLon = airport.lon - lon
    const dist = dLat * dLat + dLon * dLon
    if (dist < minDist) {
      minDist = dist
      nearest = airport
    }
  }
  return nearest
}
