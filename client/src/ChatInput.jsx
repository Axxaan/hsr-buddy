import { useState } from 'react'

function ChatInput({ onSend, isLoading }) {
  const [value, setValue] = useState('')

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setValue('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-input">
      <input
        type="text"
        className="chat-input__field"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message Pom-Pom..."
        disabled={isLoading}
      />
      <button
        className="chat-input__send"
        onClick={handleSend}
        disabled={isLoading || !value.trim()}
      >
        Send
      </button>
    </div>
  )
}

export default ChatInput
