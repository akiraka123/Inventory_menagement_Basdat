const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const collectionRoutes = require('./routes/collectionRoute');
const itemRoutes = require('./routes/itemRoute');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
