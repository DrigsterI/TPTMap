
const express = require('express');
const nunjucks = require('nunjucks');
const https = require('https');
const { json } = require('express');
const fs = require('fs');
const SearchRoutes = require('./routes/Search.js');

const app = express();

app.set('view engine', 'html');
app.set('views', './views');

app.use(express.static('./public'));

const env = nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = 3000;


var ru = { Floors:"Этажи", Building: "Корпус", Home:"Домашняя страница", AboutUs: "О Нас" ,Languages: "Языки:"};
var est = { Floors:"Korrus", Building: "Hoone", Home:"Koduleht", AboutUs: "Meist" ,Languages: "Keeled:"};
var eng = { Floors:"Floor", Building: "Building", Home:"Home", AboutUs: "AboutUs" ,Languages: "Languages:"};


var localization = eng;

app.get('/ru', (req, res) => {
  localization = ru;
  return res.redirect("/");
});

app.get('/est', (req, res) => {
  localization = est;
  return res.redirect("/");
});

app.get('/eng', (req, res) => {
  localization = eng;
  return res.redirect("/");
});

app.get('/', (req, res) => {
  res.redirect('/A/1');
});
app.get('/about', (req, res) => {
  res.render('aboutus.html');
});

app.get('/:building/:floor', (req, res) => {
  if (!req.params.building.match(/^[a-zA-Z]$/)) {
    return res.redirect("/");
  }

  if (!req.params.floor.match(/^[0-9]+$/)) {
    return res.redirect("/");
  }
  if (fs.existsSync(`public/imgs/maps/${req.params.building}/${req.params.floor}.svg`)) {
    return res.render('index', { mapUrl: `/imgs/maps/${req.params.building}/${req.params.floor}.svg`, items: localization });
  }
  return res.render('index', {items: localization});
});

app.use('/:building/:floor', SearchRoutes);

app.get('/about', (req, res) => {
  res.render('aboutus');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
