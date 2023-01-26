# TPTmap

TPT Map Web App application in which the map of the TPT building with 5 floors and 4 buildings.
Easy to use with nice interface.
The application is intended for first-year students who are already studying, parents of students and school employees.
***********************************************************************************************************************
### Application functionality ###
1. Search by class/group
2. Floor selection 0-1-2-3-4-5 of the main TPT building
3. Selection of the body of the main building of the TPT
4. Card manipulation. Clicking on a card gives an increased volume of it.
5. Zoom in and out of the map.
6. Selecting an element of the map and manipulating it (office, toilet, other TPT rooms)
7. Accurate exploitation of the application. HELP
8. Developer feedback. Write him a letter with wishes or a complaint
9. Exit
***********************************************************************************************************************
### Prerequisites ###
**Project dependencies and how to install them:**
Back-end: [Node.js](https://nodejs.org/en/) | [Express.js](Node.js)



**Download the installer from NodeJS WebSite.*

**Run the installer.*

**Follow the installer steps, agree the license agreement and click the next button.*

**Restart your system/machine.*
<p>&nbsp;</p>
- [ ] Assuming You have node and npm properly installed on the machine

- [ ] Download the code

- [ ] Navigate to inside the project folder on terminal, where I would hopefully see a package.json file

- [ ] Do an npm install for installing all the project dependencies

- [ ] Do an npm install -g nodemon for installing all the project dependencies

- [ ] Then npm start OR node app.js OR nodemon app.js to get the app running on local host
use nodemon app.js ( nodemon is a utility that will monitor for any changes in your source and automatically restart your server)

:tada:   :tada:   :tada:
<p>&nbsp;</p>

Create a file named _app.js_ => copy code below
```
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

Running Hello World
It's simple to run app.js with Node.js. From a terminal, just type:

```
node app.js
```
Front-end: [Bootstrap](https://getbootstrap.com/)



Map Library: [OpenLayers](https://openlayers.org/)

Map Format: [SVG](https://www.w3schools.com/graphics/svg_intro.asp)
