import { useEffect, useState, useRef } from 'react';
import api from '../lib/api';

export default function ChatBox({ currentUserId, teammateId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch history first
    api.get(`/chat/history/${currentUserId}/${teammateId}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));

    // Connect WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = import.meta.env.VITE_API_URL.replace(/^https?:\/\//, '');
    ws.current = new WebSocket(`${protocol}//${host}/ws/chat/${currentUserId}`);

    ws.current.onmessage = (event) => {
      const incomingMessage = JSON.parse(event.data);
      if (incomingMessage.sender_id === teammateId) {
         setMessages(prev => [...prev, incomingMessage]);
      }
    };

    return () => ws.current.close();
  }, [currentUserId, teammateId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const messageData = { receiver_id: teammateId, content: input };
    ws.current.send(JSON.stringify(messageData));
    
    setMessages(prev => [...prev, { sender_id: currentUserId, content: input }]);
    setInput('');
  };

  return (
    
      
        {messages.map((msg, index) => (
          
            
              {msg.content}
            
          
        ))}
        
      
      
         setInput(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="border p-2 flex-1 rounded"
          placeholder="Type a message..."
        />
        
          Send
        
      
    
  );
}
