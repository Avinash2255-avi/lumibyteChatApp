import React, {useState} from 'react';

export default function ChatInput({onSend}) {
  const [text, setText] = useState('');
  function submit(e){
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  }
  return (
    <form onSubmit={submit} className="flex gap-2">
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type your question..." className="flex-1 px-3 py-2 border rounded bg-white dark:bg-gray-900" />
      <button className="px-4 py-2 bg-green-600 text-white rounded">Send</button>
    </form>
  );
}