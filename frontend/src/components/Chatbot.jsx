import React, { useState } from 'react';

const Chatbot = ({ onFilter }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [memory, setMemory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/generate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response:', data);

      const botMessage = {
        sender: 'bot',
        text: data.response || 'No response from bot',
      };
      setMessages((prev) => [...prev, botMessage]);

      const filter = data.filter;
      const isEmptyFilter =
        !filter ||
        (Object.keys(filter).length === 0 || Object.values(filter).every(
          v => v === null || v === '' || (Array.isArray(v) && v.length === 0)
        ));

      if (!isEmptyFilter) {
        console.log('Applying filter:', filter);
        onFilter(filter);
      }

      if (data.memory) {
        setMemory(data.memory);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const botMessage = {
        sender: 'bot',
        text: 'Error: Could not get response.',
      };
      setMessages((prev) => [...prev, botMessage]);
    }

    setInput('');
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}>
      <h3 style={{ marginBottom: '10px' }}>Chatbot</h3>

      <div
        style={{
          border: '1px solid #eee',
          borderRadius: '4px',
          padding: '10px',
          height: '300px',
          overflowY: 'scroll',
          marginBottom: '10px',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              marginBottom: '5px',
            }}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about products..."
          style={{ flex: 1, marginRight: '5px', padding: '5px' }}
        />
        <button type="submit" style={{ padding: '5px 10px' }}>
          Send
        </button>
      </form>

      {memory.length > 0 && (
        <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#444' }}>
          <h4>Conversation Context</h4>
          <ul>
            {memory.map((entry, idx) => (
              <li key={idx}>
                <strong>{entry.intent}</strong>: {entry.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
