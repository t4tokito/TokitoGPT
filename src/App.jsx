import React, { useState, useRef, useEffect } from 'react'
import muichiro from './mui2.png'

const STORAGE_KEY = 'tokitogpt-chat'

// in-character quick prompts
const QUICK_MESSAGES = [
  "Who are you?",
  "Teach me Mist Breathing",
  "What are you thinking about?",
  "Tell me about your brother",
]

// pixel-art renderer: downsamples the image then upscales with pixelated rendering
function PixelImage({ src, pixelSize = 64, className }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = src
    img.onload = () => {
      const ratio = img.height / img.width
      const w = pixelSize
      const h = Math.round(pixelSize * ratio)
      canvas.width = w
      canvas.height = h
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(img, 0, 0, w, h)
    }
  }, [src, pixelSize])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}

const App = () => {

  const [input, setInput] = useState('')
  const [message, setMessage] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [message, loading])

  // focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // persist chat across reloads
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(message))
    } catch {
      // ignore quota errors
    }
  }, [message])

  function clearChat() {
    setMessage([])
    localStorage.removeItem(STORAGE_KEY)
    inputRef.current?.focus()
  }

  function now() {
    const d = new Date()
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  async function sendmsg(textArg) {

    const text = (textArg ?? input).trim()
    if (text === "" || loading) return

    // build history from the messages so far (before this turn)
    const chatHistory = message.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text
    }))

    const usermessage = { sender: "user", text, time: now() }

    // show the user's message immediately and clear the input
    setMessage((prev) => [...prev, usermessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("https://chatbot-backend-2-crcn.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: chatHistory })
      })

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      const data = await response.json()
      setMessage((prev) => [...prev, { sender: "bot", text: data.reply, time: now() }])
    } catch (err) {
      console.error(err)
      setMessage((prev) => [...prev, {
        sender: "bot",
        text: "...the mist is too thick right now. try again in a moment.",
        time: now()
      }])
    } finally {
      setLoading(false)
    }
  }

  const isEmpty = message.length === 0

  return (
    <div className='relative w-full h-screen flex flex-col items-center overflow-hidden text-[#e6eef0]'>

      {/* ===== animated background ===== */}
      <div className='mist-bg'>
        <div className='mist-layer l1'></div>
        <div className='mist-layer l2'></div>
        <div className='mist-layer l3'></div>
      </div>
      <div className='grid-overlay'></div>

      {/* ===== app shell ===== */}
      <div className='relative z-10 flex flex-col w-full max-w-4xl h-full px-3 md:px-6 py-4'>

        {/* header */}
        <div className='terminal rounded-2xl px-3 md:px-5 py-3 flex items-center justify-between gap-2 shrink-0'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='relative shrink-0'>
              <img src={muichiro} alt="Muichiro" className='w-10 h-10 md:w-11 md:h-11 rounded-full object-cover border border-[#85afaa]/40 glow-ring' />
              <span className='absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#7ee0a0] border-2 border-[#0a0e13]'></span>
            </div>
            <div className='leading-tight min-w-0'>
              <h1 className='mono text-lg md:text-2xl text-[#a8d4ce] glow-text tracking-wide truncate'>~/TokitoGPT</h1>
              <p className='mono text-[10px] md:text-xs text-[#85afaa]/70 truncate'>
                <span className='text-[#7ee0a0]'>●</span> mist-hashira · online
              </p>
            </div>
          </div>
          <div className='flex items-center gap-3 shrink-0'>
            {!isEmpty && (
              <button
                onClick={clearChat}
                className='mono text-xs md:text-sm text-[#85afaa]/80 hover:text-[#a8d4ce] border border-[#85afaa]/25 hover:border-[#85afaa]/60 rounded-md px-2.5 py-1.5 transition-all'>
                ✕ clear
              </button>
            )}
            <span className='mono text-[11px] md:text-xs text-gray-500 hidden sm:block'>made by vikas</span>
          </div>
        </div>

        {/* chat area — terminal */}
        <div className='terminal rounded-2xl flex-1 my-4 flex flex-col overflow-hidden relative'>
          {/* terminal title bar */}
          <div className='flex items-center gap-2 px-4 py-2.5 border-b border-[#85afaa]/20 shrink-0 bg-[#060a0e]/60'>
            <span className='w-3 h-3 rounded-full bg-[#ff5f56]'></span>
            <span className='w-3 h-3 rounded-full bg-[#ffbd2e]'></span>
            <span className='w-3 h-3 rounded-full bg-[#27c93f]'></span>
            <span className='mono text-xs text-[#85afaa]/70 ml-3'>tokito@mist: ~/chat</span>
          </div>

          <div className='terminal-scan'></div>

          {/* scrollable body */}
          <div className='flex-1 overflow-y-auto scrollbar-none px-3 md:px-5 py-4 relative z-[1]'>
          {isEmpty && (
            <div className='hero-in flex flex-col items-center justify-center h-full text-center'>
              <PixelImage src={muichiro} pixelSize={56} className='float h-28 sm:h-32 md:h-40' />

              {/* terminal boot output */}
              <div className='mono text-left text-xs sm:text-sm mt-4 leading-relaxed inline-block'>
                <p className='text-[#85afaa]'>$ ./summon --hashira mist</p>
                <p className='text-gray-500'>[ <span className='text-[#7ee0a0]'>ok</span> ] connecting to the mist...</p>
                <p className='text-gray-500'>[ <span className='text-[#7ee0a0]'>ok</span> ] muichiro tokito is online</p>
                <p className='text-[#a8d4ce] mt-1'>&gt; I would like to talk with you<span className='caret'></span></p>
              </div>

              {/* quick message chips */}
              <div className='flex flex-wrap justify-center gap-2 mt-4 md:mt-5 px-2 max-w-lg'>
                {QUICK_MESSAGES.map((q, idx) => (
                  <button
                    key={q}
                    onClick={() => sendmsg(q)}
                    style={{ animationDelay: `${0.15 + idx * 0.08}s` }}
                    className='chip-in mono text-xs sm:text-sm bg-[#1a2230]/70 hover:bg-[#85afaa]/20 text-[#a8d4ce] border border-[#85afaa]/25 hover:border-[#85afaa]/60 rounded-md px-3 py-1.5 transition-all hover:-translate-y-0.5'>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {message.map((msg, i) => {
            const isUser = msg.sender === "user"
            return (
              <div key={i} className={`mono text-sm md:text-base my-2.5 leading-relaxed break-words whitespace-pre-wrap ${isUser ? "msg-in-r" : "msg-in-l"}`}>
                <span className={isUser ? "text-[#85afaa]" : "text-[#a8d4ce]"}>
                  {isUser ? "user@you:~$ " : "tokito@mist:~$ "}
                </span>
                <span className={isUser ? "text-[#cfe3e0]" : "text-[#e6eef0]"}>{msg.text}</span>
                {msg.time && (
                  <span className='text-[10px] text-gray-600 ml-2'>[{msg.time}]</span>
                )}
              </div>
            )
          })}

          {loading && (
            <div className='mono text-sm md:text-base my-2.5 msg-in-l'>
              <span className='text-[#a8d4ce]'>tokito@mist:~$ </span>
              <span className='dot'></span><span className='dot'></span><span className='dot'></span>
            </div>
          )}

          <div ref={chatEndRef}></div>
          </div>
        </div>

        {/* input row */}
        <div className='terminal rounded-2xl p-2 flex items-center gap-2 shrink-0 min-w-0'>
          <span className='mono text-[#85afaa] pl-3 hidden sm:block shrink-0'>user@you:~$</span>
          <input
            ref={inputRef}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendmsg() }}
            value={input}
            type="text"
            placeholder="type a message..."
            className='mono bg-transparent text-[#e6eef0] placeholder-gray-600 w-full min-w-0 px-3 sm:px-1 py-3 outline-none' />

          <button
            onClick={() => sendmsg()}
            disabled={loading || input.trim() === ""}
            className='btn-glow shrink-0 px-4 md:px-6 py-3 bg-gradient-to-br from-[#a8d4ce] to-[#85afaa] text-[#0a0e13] font-bold rounded-md disabled:opacity-30 disabled:shadow-none mono'>
            [ send ]
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
