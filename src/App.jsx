import React, { useState, useRef, useEffect } from 'react'
import muichiro from './mui2.png'

const App = () => {

  const [input,setInput] = useState('')
  const bot ='hello how r u'
  const [message,setMessage] = useState([])
  const chatEndRef = useRef(null)
  const chatHistory = message.map((msg) => {
    return {
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text
    }
  })

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
        behavior: "smooth"
    })

  }, [message])
  
  async function sendmsg (){

        const response = await fetch("https://chatbot-backend-2-crcn.onrender.com/chat", {

      method: "POST",

      headers: {
          "Content-Type": "application/json"
      },

      body: JSON.stringify({
          message: input,
          history: chatHistory
      })

    })
    
    const data = await response.json()
    const aireply = data.reply

    if (input.trim()==="") return

    const usermessage = {
      sender: "user",
      text: input
    }

    const botmessage = {
      sender: "bot",
      text: aireply
    }
    setMessage([...message,usermessage,botmessage])
    setInput("")
  }

  return (
    <div className='w-full h-screen bg-gray-100 flex flex-col justify-center items-center'> 
      <div className='flex flex-row bg-gray-200 w-screen h-20 justify-between items-center rounded-lg'>
        <h1 className='lilita-one-regular text-2xl font-bold mb-5 text-gray-800 mt-5 mr-auto ml-5 md:text-4xl bold'>TokitoGPT</h1>
        <h1 className='onset-regular text-sm mb-5 text-gray-800 mt-5 ml-auto md:text-lg mr-5'>made by vikas</h1>
      </div>
      <div className=' w-[90%] h-screen m-5 bg-gray-200 overflow-y-scroll scrollbar-none rounded-lg '>
        <div className={`${
            message.length === 0
            ?"visible"
            :"hidden"
          }`}>
        <h1 className='lilita-one-regular text-4xl font-bold text-center mb-5 text-gray-800 mt-5 md:text-6xl bold'>
          I'm Muichiro Tokito!!</h1>
        <h1 className={`text-center mt-5 md:text-3xl pixel-font
          ${
            message.length === 0
            ?"visible"
            :"hidden"
          }`}>I would like to talk with u</h1>
        <img src={muichiro} alt="Muichiro Tokito" className='h-60 ml-auto mr-auto'/>
          </div>
        {
        message.map((msg) => (
            <div className={`flex m-5 ${
              msg.sender=== "user"
              ?"justify-end"
              :"justify-start"
            }`}>
              <div className={`p-3 rounded-lg oneset-regular ${
              msg.sender=== "user"
              ?"bg-blue-200"
              :"bg-gray-300"
            }`}>
              {msg.text}
              </div>
            </div>
        ))
        }
        <div ref={chatEndRef}></div>
        
      </div>

      <div className='flex flex-row h-min-10 
        h-max-auto
        w-[90%] 
        mt-auto 
        ml-[3%] '>

        <input onChange={(e)=> setInput(e.target.value)}
        onKeyDown={(e) => {
   if(e.key === "Enter"){
      sendmsg()
   }
}}
        value={input}
        type="text" 
        placeholder="message" 
        className='
        bg-gray-200
        h-min-10 
        h-max-auto
        w-[90%]
        mb-5 
        p-5
        border-0
        rounded-lg
        flex-col'/>

        <h1 onClick={sendmsg}
        className='mt-auto h-15 w-20 text-center justify-center bg-gray-200 m-5 pt-4 rounded-lg' >send</h1>
      </div>
    </div>
  )
}

export default App
