import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/proxy', async (req, res) => {
  const { apiUrl, queryParams } = req.body;
  
  try {
    const url = new URL(apiUrl);
    Object.keys(queryParams).forEach(key => {
      url.searchParams.append(key, queryParams[key]);
    });
    console.log(url.toString());
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const text = await response.text();
    let data;
    
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.warn('Response is not JSON:', text);
      data = { message: text };
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error forwarding request:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
