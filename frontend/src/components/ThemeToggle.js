import React, {useEffect, useState} from 'react';

export default function ThemeToggle(){
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    if(theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div>
      <button onClick={()=>setTheme(t => t==='dark'?'light':'dark')} className="px-3 py-2 border rounded">
        Toggle {theme === 'dark' ? '🌙' : '☀️'}
      </button>
    </div>
  )
}