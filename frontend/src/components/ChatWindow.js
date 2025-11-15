import React, {useEffect, useState, useRef} from 'react';
import { useParams } from 'react-router-dom';
import TableResponse from './TableResponse';
import ChatInput from './ChatInput';
import AnswerFeedback from './AnswerFeedback';
import { API_BASE } from '../config';


function makeMessageId(msg, idx) {
  if (msg && msg.id) return msg.id;
  if (msg && msg.time) return `msg-${msg.time}`;
  return `msg-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;
}

export default function ChatWindow() {
  const { sessionId } = useParams();
  const [history, setHistory] = useState([]);
  const containerRef = useRef();

  
  useEffect(() => {
    if (!sessionId) {
      setHistory([]);
      return;
    }

    fetch(`${API_BASE}/api/session/${sessionId}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch session');
        return r.json();
      })
      .then(data => {
        const incoming = (data.history || []).map((m, i) => ({
          ...m,
          id: makeMessageId(m, i),
        }));
        setHistory(incoming);
      })
      .catch(err => {
        console.error('Load session error:', err);
        setHistory([]);
      });
  }, [sessionId]);

  
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setTimeout(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, 50);
  }, [history]);

  
  async function send(question) {
    if (!sessionId) {
      alert('No session selected. Click New Chat first.');
      return;
    }
    if (!question || !question.trim()) return;

    
    const optimisticUserId = `msg-${Date.now()}-user`;
    const userMsg = { id: optimisticUserId, from: 'user', text: question };
    setHistory(h => [...h, userMsg]);

    try {
      const resp = await fetch(`${API_BASE}/api/chat/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!resp.ok) throw new Error('Chat API error');

      const body = await resp.json();

      const serverUserId = body.userMessageId;
      if (serverUserId) {
        setHistory(prev =>
          prev.map(m =>
            m.id === optimisticUserId ? { ...m, id: serverUserId } : m
          )
        );
      }

      // Bot message
      const botId = body.botMessageId || `msg-${Date.now()}-bot`;
      const botMsg = {
        id: botId,
        from: 'bot',
        text: body.text || '',
        structured: body.structured || [],
        feedback: body.feedback,
      };

      setHistory(h => [...h, botMsg]);
    } catch (err) {
      console.error('Send error:', err);
      const errMsg = {
        id: `msg-${Date.now()}-err`,
        from: 'bot',
        text: 'Error: failed to get response',
      };
      setHistory(h => [...h, errMsg]);
    }
  }

  
  function handleFeedback(messageId, fb) {
    
    setHistory(prev =>
      prev.map(m => (m.id === messageId ? { ...m, feedback: fb } : m))
    );

   
    fetch(`${API_BASE}/api/session/${sessionId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId, feedback: fb }),
    })
      .then(async r => {
        if (!r.ok) {
          const text = await r.text().catch(() => null);
          console.warn('Failed to save feedback', r.status, text);
        }
      })
      .catch(err => console.warn('Feedback save error', err));
  }

  return (
    <div className="flex flex-col h-[80vh] border rounded p-3 bg-white dark:bg-gray-800">
      <div className="flex-1 overflow-auto mb-3" ref={containerRef}>
        {history.length === 0 && (
          <div className="p-6 text-gray-500">
            No messages yet — ask something!
          </div>
        )}

        {history.map(m => (
          <div key={m.id} className={`mb-4 ${m.from === 'user' ? 'text-right' : ''}`}>
            <div
              className={`inline-block p-3 rounded ${
                m.from === 'user'
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              <div className="text-sm">{m.text}</div>
              {m.structured && (
                <div className="mt-2">
                  <TableResponse data={m.structured} />
                </div>
              )}
            </div>

            {m.from === 'bot' && (
              <AnswerFeedback
                initial={m.feedback || 'none'}
                onFeedback={fb => handleFeedback(m.id, fb)}
              />
            )}
          </div>
        ))}
      </div>

      <ChatInput onSend={send} />
    </div>
  );
}
