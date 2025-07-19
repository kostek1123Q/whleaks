const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const messagesPath = path.join(__dirname, 'data', 'messages.json');
const ADMIN_PASSWORD = 'superhaslo123'; // <- zmień na własne

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API - Pobierz wiadomości
app.get('/api/messages', (req, res) => {
  const messages = JSON.parse(fs.readFileSync(messagesPath));
  res.json(messages);
});

// API - Dodaj wiadomość
app.post('/api/messages', (req, res) => {
  const messages = JSON.parse(fs.readFileSync(messagesPath));
  messages.push({ text: req.body.text });
  fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
  res.json({ success: true });
});

// API - Usuń wiadomość
app.delete('/api/messages/:id', (req, res) => {
  const messages = JSON.parse(fs.readFileSync(messagesPath));
  messages.splice(req.params.id, 1);
  fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
  res.json({ success: true });
});

// API - Edytuj wiadomość
app.put('/api/messages/:id', (req, res) => {
  const messages = JSON.parse(fs.readFileSync(messagesPath));
  messages[req.params.id].text = req.body.text;
  fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
  res.json({ success: true });
});

// API - Logowanie admina
app.post('/api/admin-login', (req, res) => {
  res.json({ success: req.body.password === ADMIN_PASSWORD });
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
