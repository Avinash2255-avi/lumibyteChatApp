
function makeMessageId() {
  return `msg-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

const sessions = [
  { id: 'session-1', title: 'Sales Data Analysis' },
  { id: 'session-2', title: 'Inventory Summary' },
];


const sessionHistories = {
  'session-1': [
    { id: makeMessageId(), from: 'user', text: 'Show me monthly sales', time: Date.now() - 100000 },
    { id: makeMessageId(), from: 'bot', text: 'Here is a summary', structured: [{month:'Jan', sales:1200},{month:'Feb', sales:1500}], time: Date.now() - 90000 }
  ],
  'session-2': [
    { id: makeMessageId(), from: 'user', text: 'Inventory counts', time: Date.now() - 80000 },
    { id: makeMessageId(), from: 'bot', text: 'Table attached', structured: [{item:'Widget A', qty:50},{item:'Widget B', qty:20}], time: Date.now() - 70000 }
  ]
};

let nextSessionCounter = 3;
function getNewSessionId(){
  const id = `session-${nextSessionCounter++}`;
  sessions.unshift({ id, title: `New Session ${id}` });
  sessionHistories[id] = [];
  return id;
}


function appendMessage(sessionId, message) {
  if (!sessionHistories[sessionId]) sessionHistories[sessionId] = [];
  const msg = { ...message };
  if (!msg.id) msg.id = makeMessageId();
  if (!msg.time) msg.time = Date.now();
  sessionHistories[sessionId].push(msg);
  return msg;
}

function generateChatResponse(question){
  const sampleTable = [
    { metric: 'A', value: Math.floor(Math.random()*100) },
    { metric: 'B', value: Math.floor(Math.random()*100) },
    { metric: 'C', value: Math.floor(Math.random()*100) }
  ];
  const text = `Mock answer for: "${question}". Below is a small structured result.`;
  return { text, structured: sampleTable };
}


function saveFeedback(sessionId, messageId, feedback) {
  if (!sessionHistories[sessionId]) return false;
  const msgs = sessionHistories[sessionId];
  const idx = msgs.findIndex(m => m.id === messageId);
  if (idx === -1) return false;
  msgs[idx].feedback = feedback; 
  return true;
}

module.exports = {
  sessions,
  getNewSessionId,
  sessionHistories,
  generateChatResponse,
  appendMessage,
  saveFeedback
};
