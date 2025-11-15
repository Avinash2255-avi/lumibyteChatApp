const express = require('express');
const cors = require('cors');
const {
  sessions,
  getNewSessionId,
  sessionHistories,
  generateChatResponse,
  appendMessage,
  saveFeedback
} = require('./mockData');

const app = express();
app.use(cors());
app.use(express.json());


app.get('/api/sessions', (req, res) => {
  res.json(sessions);
});


app.get('/api/new-chat', (req, res) => {
  const id = getNewSessionId();
  res.json({ sessionId: id });
});


app.get('/api/session/:id', (req, res) => {
  const id = req.params.id;
  const history = sessionHistories[id] || [];
  res.json({ sessionId: id, history });
});


app.post('/api/chat/:id', (req, res) => {
  const sessionId = req.params.id;
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ ok: false, message: 'question is required' });
  }


  const response = generateChatResponse(question);

  const userMsg = appendMessage(sessionId, { from: 'user', text: question });
  const botMsg = appendMessage(sessionId, { from: 'bot', text: response.text, structured: response.structured });


  return res.json({
    ok: true,
    text: response.text,
    structured: response.structured,
    botMessageId: botMsg.id,
    userMessageId: userMsg.id
  });
});


app.post('/api/session/:id/feedback', (req, res) => {
  const sessionId = req.params.id;
  const { messageId, feedback } = req.body; 
  if (!messageId || typeof feedback === 'undefined') {
    return res.status(400).json({ ok: false, message: 'messageId and feedback required' });
  }

  const ok = saveFeedback(sessionId, messageId, feedback);
  if (!ok) return res.status(404).json({ ok: false, message: 'message not found' });
  return res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Mock API server running on port ${PORT}`));
