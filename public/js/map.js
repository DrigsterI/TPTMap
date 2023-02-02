import Layer from '/ol/layer/Layer.js';
import Map from '/ol/Map.js';
import View from '/ol/View.js';
import {composeCssTransform} from '/ol/transform.js';

//let MapName = 'TPT_MAP.svg';
//let MapPath = '/imgs/' + MapName;
let MapPath = window.mapUrl;
let range = 100;

const map = new Map({
  target: 'map',	
  view: new View({
    center: [0, 0],
//    extent: [-180, -90, 180, 90],
    extent: [-range, -range, range, range],
    projection: 'EPSG:4326',
    zoom: 2,
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

const width = 2500;
const height = 2500;
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
        size[0] / 2,
        size[1] / 2,
        scale,
        scale,
        frameState.viewState.rotation,
        -center[0] / svgResolution - width / 2,
        center[1] / svgResolution - height / 2
      );
      svgContainer.style.transform = cssTransform;
      svgContainer.style.opacity = this.getOpacity();
      return svgContainer;
    },
  })
);












