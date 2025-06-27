const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname, 'static')));

const papers = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'papers.json'), 'utf-8'));

function searchPapers(query) {
  if (!query) return papers;
  const q = query.toLowerCase();
  return papers.filter(p =>
    p.title.toLowerCase().includes(q) ||
    (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
  );
}

app.get('/', (req, res) => {
  const q = req.query.q || '';
  const filtered = searchPapers(q);
  res.render('index', { papers: filtered, query: q });
});

app.get('/paper/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const paper = papers.find(p => p.id === id);
  if (!paper) return res.status(404).send('Not Found');
  res.render('paper', { paper });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
