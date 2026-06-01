'use client'

import { useEditor, Tiptap, useTiptap, useTiptapState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef } from 'react'

interface Props {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

const EMPTY = '<p></p>'

// Toolbar lives inside <Tiptap> so it can use the context hooks
function Toolbar() {
  const { editor } = useTiptap()
  const isBold     = useTiptapState(s => s.editor?.isActive('bold')        ?? false)
  const isItalic   = useTiptapState(s => s.editor?.isActive('italic')      ?? false)
  const isBullet   = useTiptapState(s => s.editor?.isActive('bulletList')  ?? false)
  const isOrdered  = useTiptapState(s => s.editor?.isActive('orderedList') ?? false)

  if (!editor) return null

  const btn = (active: boolean, label: React.ReactNode, title: string, action: () => void) => (
    <button
      type="button"
      title={title}
      onClick={action}
      className="w-6 h-6 rounded flex items-center justify-center text-xs transition-colors"
      style={active
        ? { backgroundColor: '#C8440B', color: '#fff' }
        : { color: '#706F5C' }}
    >
      {label}
    </button>
  )

  return (
    <div
      className="flex items-center gap-0.5 px-1.5 py-1 border-b border-[#E4E2D9] bg-white"
      onMouseDown={e => e.preventDefault()}
    >
      {btn(isBold,    <strong>B</strong>, 'Bold (Ctrl+B)',     () => editor.chain().focus().toggleBold().run())}
      {btn(isItalic,  <em>I</em>,         'Italic (Ctrl+I)',   () => editor.chain().focus().toggleItalic().run())}
      <div className="w-px h-3.5 bg-[#E4E2D9] mx-0.5" />
      {btn(isBullet,
        <svg viewBox="0 0 12 10" fill="currentColor" className="w-3 h-3">
          <circle cx="1.5" cy="2" r="1.2"/><rect x="4" y="1" width="8" height="1.8" rx="0.9"/>
          <circle cx="1.5" cy="5" r="1.2"/><rect x="4" y="4" width="8" height="1.8" rx="0.9"/>
          <circle cx="1.5" cy="8" r="1.2"/><rect x="4" y="7" width="8" height="1.8" rx="0.9"/>
        </svg>,
        'Bullet list', () => editor.chain().focus().toggleBulletList().run()
      )}
      {btn(isOrdered,
        <svg viewBox="0 0 12 10" fill="currentColor" className="w-3 h-3">
          <text x="0" y="3" fontSize="3.5" fontFamily="sans-serif">1.</text>
          <rect x="4" y="1" width="8" height="1.8" rx="0.9"/>
          <text x="0" y="6.5" fontSize="3.5" fontFamily="sans-serif">2.</text>
          <rect x="4" y="4.5" width="8" height="1.8" rx="0.9"/>
          <text x="0" y="10" fontSize="3.5" fontFamily="sans-serif">3.</text>
          <rect x="4" y="8" width="8" height="1.8" rx="0.9"/>
        </svg>,
        'Numbered list', () => editor.chain().focus().toggleOrderedList().run()
      )}
    </div>
  )
}

export default function RichNotes({ content, onChange, placeholder = 'Add notes…' }: Props) {
  const internalUpdate = useRef(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '',
    immediatelyRender: false,
    onUpdate({ editor }) {
      internalUpdate.current = true
      const html = editor.getHTML()
      onChange(html === EMPTY ? '' : html)
      requestAnimationFrame(() => { internalUpdate.current = false })
    },
    editorProps: {
      attributes: {
        class: 'rich-notes-editor outline-none min-h-[44px] text-xs px-2 py-1.5',
      },
    },
  })

  // Sync external content changes (e.g. restoring from localStorage)
  // but never while the user is editing or the update came from this editor
  useEffect(() => {
    if (!editor || internalUpdate.current || editor.isFocused) return
    const incoming = content || ''
    const current  = editor.getHTML() === EMPTY ? '' : editor.getHTML()
    if (incoming !== current) editor.commands.setContent(incoming)
  }, [content, editor])

  const empty = !content || content === EMPTY

  return (
    <div className="rounded-lg border border-[#E4E2D9] bg-[#FAFAF7] overflow-hidden focus-within:ring-1 focus-within:ring-[#C8440B]/30 focus-within:border-[#C8440B]">
      {editor ? (
        <Tiptap editor={editor}>
          <Toolbar />
          <div className="relative">
            {empty && (
              <span className="absolute top-1.5 left-2 text-xs text-[#C0BDA8] pointer-events-none select-none z-10">
                {placeholder}
              </span>
            )}
            <Tiptap.Content />
          </div>
        </Tiptap>
      ) : (
        <div className="px-2 py-1.5 min-h-[44px] text-xs text-[#C0BDA8]">{placeholder}</div>
      )}
    </div>
  )
}
