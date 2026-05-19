const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Chat & AI Service' });
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  res.json({ 
    reply: `Chào Ngài! Thần là Trợ lý Fitness. Ngài vừa nói: "${message}". Thần sẽ sớm được tích hợp với trí tuệ nhân tạo Gemini để phục vụ Ngài chu đáo hơn!` 
  });
});

app.listen(PORT, () => {
  console.log(`Chat Service is running on port ${PORT}`);
});
