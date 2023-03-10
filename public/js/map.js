import Layer from '/ol/layer/Layer.js';
import Map from '/ol/Map.js';
import View from '/ol/View.js';
import {composeCssTransform} from '/ol/transform.js';

//let MapName = '0.svg';
//let MapPath = './imgs/maps/A/' + MapName;
//let MapPath = '/imgs/maps/A/0.svg';
//
let MapPath = window.mapUrl;
let range = 100;
console.log(MapPath);
const map = new Map({
  target: 'map',	
  view: new View({
    center: [0, 0],
    projection: 'EPSG:4326',
    zoom: 2,
  }),
});
//<object data="imgs/B0.svg" type="image/svg+xml" id="bitmapsvg" width="100%" height="100%"></object>
const svgContainer = document.createElement('div');
const xhr = new XMLHttpRequest();
xhr.open('GET', MapPath);
xhr.addEventListener('load', function () {
  const svg = xhr.responseXML.documentElement;
  console.log(svg)
  svgContainer.ownerDocument.importNode(svg);
  svgContainer.appendChild(svg);
  console.log(svgContainer)
});
xhr.send();

const width = 1000;
const height = 1300;
//const svgResolution = 360 / width;
const svgResolution = 200 / width;
//svgContainer.style.width = width/2 + 'px';
svgContainer.style.width = '100%';
svgContainer.style.height = '100%';
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