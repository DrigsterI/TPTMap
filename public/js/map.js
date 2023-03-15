import Layer from '/ol/layer/Layer.js';
import Map from '/ol/Map.js';
import View from '/ol/View.js';
import {composeCssTransform} from '/ol/transform.js';

//let MapName = '0.svg';
//let MapPath = './imgs/maps/A/' + MapName;
//let MapPath = '/imgs/maps/A/0.svg';
//console.log(MapPath);
let MapPath = window.mapUrl;

const map = new Map({
  target: 'map',	
  view: new View({
    center: [0, 0],
    projection: 'EPSG:4326',
    zoom: 4.6,
    minZoom: 4,
    maxZoom: 6,
  }),
});

const svgContainer = document.createElement('div');
const xhr = new XMLHttpRequest();
xhr.open('GET', MapPath);
xhr.addEventListener('load', function () {
  const svg = xhr.responseXML.documentElement;
  svgContainer.ownerDocument.importNode(svg);
  svgContainer.appendChild(svg);
});
xhr.send();

const width = window.innerWidth;
const height = window.innerHeight;
//const svgResolution = 360 / width;
const svgResolution = 100 / width;
//svgContainer.style.width = width/2 + 'px';
svgContainer.style.width = width + 'px';
svgContainer.style.height = height + 'px';
//svgContainer.style.transformOrigin = 'top left';
svgContainer.className = 'svg-layer';

map.addLayer(
  new Layer({
    render: function (frameState) {
      const scale = svgResolution / frameState.viewState.resolution;
      const center = frameState.viewState.center;
      const size = frameState.size;
      const cssTransform = composeCssTransform(
        0, // start x
        -100, // start y
        scale, // for zooming (from frameState)
        scale, // 
        frameState.viewState.rotation, // rotation
        -center[0] / svgResolution, // move left (-)
        center[1] / svgResolution //move up (-)
      );
      svgContainer.style.transform = cssTransform;
      svgContainer.style.opacity = this.getOpacity();
      return svgContainer;
    },
  })
);












