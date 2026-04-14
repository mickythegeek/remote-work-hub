const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Remote Work Hub API is running...' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
