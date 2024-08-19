require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const url = require('url');
let urlDatabase = {}; 
let idCounter = 1;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", function(req, res) {
  console.log(req.body)
  const inputUrl = req.body.url;
  const hostname = new url.URL(inputUrl).hostname;
  console.log(hostname);

  dns.lookup(hostname, (err) => {
    if (err) {
      console.error('Error occurred:', err);
      return res.json({ error: 'invalid url' });
    }

    const id = idCounter++; // Generate a new ID
    urlDatabase[id] = inputUrl;
    res.json({ original_url: inputUrl, short_url: id }); 
  });
});

app.get("/api/shorturl/:id", function(req, res) {
  const id = req.params.id;
  const originalUrl = urlDatabase[id];
  
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
