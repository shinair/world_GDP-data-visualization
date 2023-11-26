const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/imf-data', async (req, res) => {
  const url = 'https://www.imf.org/external/datamapper/api/v1/NGDP_RPCH?periods=2022';

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching IMF data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});