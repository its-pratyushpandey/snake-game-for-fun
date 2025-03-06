
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once('open', () => console.log('MongoDB connected'))
  .on('error', (err) => console.log('MongoDB connection error:', err));

const scoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true },
});

const Score = mongoose.model('Score', scoreSchema);

app.post('/score', async (req, res) => {
  const { name, score } = req.body;
  try {
    const newScore = new Score({ name, score });
    await newScore.save();
    res.status(200).send('Score saved');
  } catch (err) {
    res.status(400).send('Error saving score');
  }
});

app.get('/scores', async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 });
    res.status(200).json(scores);
  } catch (err) {
    res.status(400).send('Error retrieving scores');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
