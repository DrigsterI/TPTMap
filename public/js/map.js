import Layer from "/ol/layer/Layer.js";
import Map from "/ol/Map.js";
import View from "/ol/View.js";
import { composeCssTransform } from "/ol/transform.js";

//let MapName = '0.svg';
//let MapPath = './imgs/maps/A/' + MapName;
//let MapPath = '/imgs/maps/A/0.svg';
//
let MapPath = window.mapUrl;
const map = new Map({
  target: "map",
  view: new View({
    center: [0, 0],
    projection: "EPSG:4326",
    zoom: 4.6,
    minZoom: 4,
    maxZoom: 6,
  }),
});
//<object data="imgs/B0.svg" type="image/svg+xml" id="bitmapsvg" width="100%" height="100%"></object>
const svgContainer = document.createElement("div");
const xhr = new XMLHttpRequest();
xhr.open("GET", MapPath);
xhr.addEventListener("load", function () {
  const svg = xhr.responseXML.documentElement;
  svgContainer.ownerDocument.importNode(svg);
  svgContainer.appendChild(svg);
});
xhr.send();

const width = window.innerWidth;
const height = window.innerHeight;
//const svgResolution = 360 / width;
const svgResolution = 118 / width;
//svgContainer.style.width = width/2 + 'px';
svgContainer.style.width = width + "px";
svgContainer.style.height = height + "px";
//svgContainer.style.transformOrigin = 'top left';
svgContainer.className = "svg-layer";

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
map.once("rendercomplete", function (event) {
  setTimeout(() => {
    var stily =
      "fill:rgb(10, 116, 245);stroke:rgb(10, 116, 245); stroke-width:2;stroke-opacity:1;fill-opacity:0.7";
    var mesto = String(window.location.href);
    var pathname = String(window.location.pathname)
    var building = pathname.charAt(1)
    var floor = pathname.charAt(3)
    console.log(mesto.indexOf("="));
    var activeFloor = document.getElementById("floor" + floor.toString());
    var activeBuildingOne = document.getElementById("1building" + building.toString());
    var activeBuildingTwo = document.getElementById("2building" + building.toString());
    activeFloor.classList.add("active-right-tab");
    activeBuildingOne.classList.add("active-right-tab");
    activeBuildingTwo.classList.add("active-right-tab");
    if(mesto.indexOf("=")!='-1'){
      var room = String(mesto.substring(mesto.indexOf("=") + 1));
      if (room.length == 5) {
        room = room.slice(0, -1) + room.charAt(4).toLowerCase();
      }
      if (room != null) {
        
        var delta = document.getElementById(room); // klass
        delta.style = stily;
        var k = delta.children.length;
        if (k > 0) {
          for (i = 0; i < k; i++) {
            delta.children[i].style = stily;
          }
        } else {
          delta.style = stily;
        }
      }
    }

  }, "0");
});
