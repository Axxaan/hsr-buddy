import { useState } from 'react'
import ChatWindow from './ChatWindow'
import ChatInput from './ChatInput'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function App() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  async function handleSend(content) {
    const nextMessages = [...messages, { role: 'user', content }]
    setMessages(nextMessages)
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = await res.json()
      const content = data.reply ?? ''
      setMessages(prev => [...prev, { role: 'assistant', content }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-app">
      <ChatWindow messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  )
}

export default App
