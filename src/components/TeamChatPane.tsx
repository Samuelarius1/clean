import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check, MessageCircle, Send, X } from 'lucide-react'
import { sendContactMessage } from '../services/api'

type ChatMessage = { id: number; text: string; sender: 'visitor' | 'team' }

type Props = { mode: 'dark' | 'light' }

export function TeamChatPane({ mode }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanMessage = message.trim()
    if (!cleanMessage || sending) return
    setSending(true)
    setError('')
    try {
      await sendContactMessage({ name: name.trim(), email: email.trim(), subject: 'Website team chat', message: cleanMessage })
      setMessages(current => [
        ...current,
        { id: Date.now(), text: cleanMessage, sender: 'visitor' },
        { id: Date.now() + 1, text: `Thanks, ${name.trim().split(/\s+/)[0]}. Your message is with our team. We’ll reply to ${email.trim()}.`, sender: 'team' },
      ])
      setMessage('')
      window.requestAnimationFrame(() => inputRef.current?.focus())
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'We couldn’t send that just now. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return <div className={`team-chat ${open ? 'is-open' : ''}`} data-theme={mode}>
    {open && <section id="team-chat-panel" className="team-chat-panel" role="dialog" aria-modal="false" aria-labelledby="team-chat-title">
      <header className="team-chat-header">
        <div className="team-chat-avatar" aria-hidden="true"><MessageCircle size={19} /></div>
        <div><h2 id="team-chat-title">Talk to our team</h2><p><span className="team-chat-status" /> We’ll reply by email</p></div>
        <button type="button" className="team-chat-close" onClick={() => setOpen(false)} aria-label="Close team chat"><X size={19} /></button>
      </header>
      <div className="team-chat-content">
        <p className="team-chat-intro">Tell us what you need help with. Your message goes straight to the CleanPro team.</p>
        {messages.length > 0 && <ol className="team-chat-messages" aria-live="polite">{messages.map(item => <li className={`team-chat-message ${item.sender}`} key={item.id}><span>{item.text}</span>{item.sender === 'team' && <small><Check size={12} /> Delivered</small>}</li>)}</ol>}
        <form className="team-chat-form" onSubmit={handleSubmit}>
          <div className="team-chat-contact-fields">
            <label>Your name<input autoComplete="name" maxLength={120} onChange={event => setName(event.target.value)} placeholder="Jane Smith" required value={name} /></label>
            <label>Email for our reply<input autoComplete="email" maxLength={190} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" required type="email" value={email} /></label>
          </div>
          <label className="sr-only" htmlFor="team-chat-message">Your message</label>
          <textarea id="team-chat-message" ref={inputRef} maxLength={2400} onChange={event => setMessage(event.target.value)} placeholder="How can we help?" required rows={3} value={message} />
          {error && <p className="team-chat-error" role="alert">{error}</p>}
          <div className="team-chat-form-footer"><span>Private message · {message.length}/2400</span><button className="team-chat-send" disabled={sending || !message.trim()} type="submit">{sending ? 'Sending…' : 'Send'} <Send size={15} /></button></div>
        </form>
      </div>
    </section>}
    <button type="button" className="team-chat-launcher" aria-controls="team-chat-panel" aria-expanded={open} aria-label={open ? 'Close chat with the team' : 'Chat with the CleanPro team'} onClick={() => setOpen(value => !value)}>
      {open ? <X size={21} /> : <MessageCircle size={21} />}<span>{open ? 'Close' : 'Chat with us'}</span>
    </button>
  </div>
}
