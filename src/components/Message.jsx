import './Message.css'

export default function Message({ role, content }) {
  return (
    <div className={`message ${role}`}>
      <div className="bubble">
        <pre className="message-text">{content}</pre>
      </div>
    </div>
  )
}
