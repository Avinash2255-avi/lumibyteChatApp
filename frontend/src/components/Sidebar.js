import React, {useEffect, useState} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { API_BASE } from '../config';


export default function Sidebar(){
  const [sessions, setSessions] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=> {
    fetch(`${API_BASE}/api/sessions`)
      .then(r=>r.json())
      .then(setSessions)
      .catch(()=>setSessions([]));
  }, []);

function newChat(){
  fetch(`${API_BASE}/api/new-chat`)
    .then(r => r.json())
    .then(data => {
      
      const newSession = { id: data.sessionId, title: `New Session ${data.sessionId}` };
      setSessions(prev => [newSession, ...prev]);
      navigate(`/chat/${data.sessionId}`);
    })
    .catch(err => {
      console.error('Failed to create session', err);
    });
}


  return (
    <aside className={`w-72 bg-white dark:bg-gray-800 border-r dark:border-gray-700 ${collapsed ? 'hidden md:block' : ''}`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-lg font-bold">Conversations</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Mock sessions</div>
          </div>
          <button onClick={()=>setCollapsed(!collapsed)} className="text-sm px-2 py-1 rounded border">Toggle</button>
        </div>
        <button onClick={newChat} className="w-full mb-3 px-3 py-2 bg-blue-600 text-white rounded">+ New Chat</button>
        <ul>
          {sessions.map(s => (
            <li key={s.id} className={`mb-2 ${location.pathname.includes(s.id) ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
              <Link to={`/chat/${s.id}`} className="block p-3">
                <div className="font-medium">{s.title || s.id}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{s.id}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}