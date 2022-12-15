const express = require('express');
const nunjucks = require('nunjucks');

const app = express();

app.set('view engine', 'html');
app.set('views', './views');

app.use(express.static('./public'));

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/about', (req, res) => {
  res.render('aboutus');
})

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
})