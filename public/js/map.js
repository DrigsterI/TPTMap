class Map {
    zoom = 1;
    width;
    height;

    lastMouseX;
    lastMouseY;

    posX = 0;
    posY = 0;

    zoomMax = 2.5;
    zoomMin = 0.2;

    map;
    svg;

    scaling = false;
    pinchStartDistance;

    callback;
    isMapMoved = false;

    constructor(id, zoom, posX, posY, callback) {
        this.id = id;
        this.zoom = zoom;
        this.posX = posX;
        this.posY = posY;
        this.callback = callback;

        this.main();
    }

    async main() {
        this.map = document.getElementById(this.id);
        this.map.style.overflow = "hidden";
        this.map.setAttribute("draggable", "false");

        this.width = this.map.clientWidth;
        this.height = this.map.clientHeight;

        const svgNS = "http://www.w3.org/2000/svg";
        this.svg = document.createElementNS(svgNS, "svg");
        this.image = document.createElementNS(svgNS, "image");
        this.svg.setAttributeNS(null, "draggable", "false");
        this.svg.setAttributeNS(null, "ondragstart", "return false;");
        this.svg.style.MozUserSelect = "none";
        this.svg.style.position = "relative";

        let svgHTML = await (await fetch(mapUrl)).text();
        let tempSvgElement = document.createElement("svg");
        tempSvgElement.innerHTML = svgHTML;
        svgHTML = tempSvgElement.getElementsByTagName('svg')[0].innerHTML;

        this.svg.innerHTML = svgHTML;
        this.map.appendChild(this.svg);

        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "position-absolute bottom-0 start-0"

        const zoomInButton = document.createElement("button");
        zoomInButton.innerHTML = "+";
        zoomInButton.className = "nav-link bg-dark text-white border rounded";
        zoomInButton.onclick = this.zoomIn.bind(this, true);

        const zoomOutButton = document.createElement("button");
        zoomOutButton.innerHTML = "–";
        zoomOutButton.className = "nav-link bg-dark text-white border rounded";
        zoomOutButton.onclick = this.zoomOut.bind(this, true);

        buttonsDiv.appendChild(zoomInButton);
        buttonsDiv.appendChild(zoomOutButton);
        document.body.appendChild(buttonsDiv);

        // getting svg size
        let bbox = this.svg.getBBox();
        // multiplying svg size to percentage of svg size to window height
        // making svg be 100 of height of the window
        this.width = bbox.width * (((window.innerHeight * 100) / bbox.height) / 100);
        this.height = bbox.height * (((window.innerHeight * 100) / bbox.height) / 100);
        this.lastMouseX = window.innerWidth / 2;
        this.lastMouseY = window.innerHeight / 2;
        
        this.svg.setAttributeNS(null, "viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);

        this.svg.setAttributeNS(null, "width", this.width);
        this.svg.setAttributeNS(null, "height", this.height);
        this.posX = (window.innerWidth - this.width) / 2;
        this.svg.style.left = this.posX + "px";
        this.posY = (window.innerHeight - this.height) / 2;
        this.svg.style.top = this.posY + "px";

        this.updateSvgSize();

        this.callback();

        this.map.addEventListener("mousedown", () => {
            this.isMapMoved = true;
        });

        this.map.addEventListener("mouseup", () => {
            this.isMapMoved = false;
        });

        this.map.addEventListener("mouseleave", () => {
            this.isMapMoved = false;
        });

        this.map.addEventListener("touchstart", (event) => {
            if (event.touches.length == 1) {
                this.isMapMoved = true;
                this.lastMouseX = undefined;
                this.lastMouseY = undefined;
            }
            else if (event.touches.length == 2) {
                this.scaling = true;
            }
            event.preventDefault();
        });

        this.map.addEventListener("touchend", () => {
            this.isMapMoved = false;
            this.scaling = false;
            this.pinchStartDistance = undefined;
            this.lastMouseX = undefined;
            this.lastMouseY = undefined;
        });

        this.map.addEventListener("ontouchcancel", () => {
            this.isMapMoved = false;
            this.scaling = false;
            this.pinchStartDistance = undefined;
            this.lastMouseX = undefined;
            this.lastMouseY = undefined;
        });

        this.map.addEventListener("mousemove", this.mouseMove.bind(this));
        this.map.addEventListener("touchmove", (event) => {
            if (event.touches.length == 1) {
                this.touchMove(event);
            }
            else if (event.touches.length == 2) {
                let distance = Math.hypot(
                    event.touches[0].pageX - event.touches[1].pageX,
                    event.touches[0].pageY - event.touches[1].pageY
                );
                if (this.pinchStartDistance == undefined) {
                    this.pinchStartDistance = distance;
                    return;
                }
                if ((this.pinchStartDistance - distance) > 25) {
                    this.pinchStartDistance = distance;
                    this.zoomOut(true);
                }
                else if ((this.pinchStartDistance - distance) < -25) {
                    this.pinchStartDistance = distance;
                    this.zoomIn(true);
                }
            }
        });

        addEventListener("drag", (event) => {
            event.preventDefault();
        });

        addEventListener("wheel", (event) => {
            if (event.wheelDelta > 0) {
                this.zoomIn()
            }
            else if (event.wheelDelta < 0) {
                this.zoomOut()
            }
        });
    }
    
    updateSvgSize(zoomToCenter = false) {
        let deltaX = this.svg.getAttributeNS(null, "width") - Math.floor(this.width * this.zoom);
        let deltaY = this.svg.getAttributeNS(null, "height") - Math.floor(this.height * this.zoom);

        let mouseDeltaX;
        let mouseDeltaY;
        if (!zoomToCenter) {
            // delta relative to mouse position
            // delta multiplied on percentage of mouse position to size of the map
            // mouse position = left/up - 0, center - 0.5, right/bottom - 1
            mouseDeltaX = deltaX * ((((this.lastMouseX - this.posX) * 100) / this.svg.getAttributeNS(null, "width")) / 100);
            mouseDeltaY = deltaY * ((((this.lastMouseY - this.posY) * 100) / this.svg.getAttributeNS(null, "height")) / 100);
        }
        else {
            mouseDeltaX = deltaX * 0.5;
            mouseDeltaY = deltaY * 0.5;
        }

        this.posX = this.posX + mouseDeltaX;
        this.svg.style.left = this.posX + "px";
        this.posY = this.posY + mouseDeltaY;
        this.svg.style.top = this.posY + "px";

        this.svg.setAttributeNS(null, "width", Math.floor(this.width * this.zoom));
        this.svg.setAttributeNS(null, "height", Math.floor(this.height * this.zoom));
    }

    zoomIn(zoomToCenter = false) {
        if(this.zoom >= this.zoomMax){
            return;
        }
        this.zoom = (parseFloat(this.zoom) + 0.1).toPrecision(5);
        this.updateSvgSize(zoomToCenter);
    }

    zoomOut(zoomToCenter = false) {
        
        if(this.zoom <= this.zoomMin){
            return;
        }
        this.zoom = (parseFloat(this.zoom) - 0.1).toPrecision(5);
        this.updateSvgSize(zoomToCenter);
    }

    mouseMove(event) {
        let x = event.clientX;
        let y = event.clientY;
        if (this.lastMouseX == undefined) {
            this.lastMouseX = x;
            this.lastMouseY = y;
            return;
        }
        let deltaX = this.lastMouseX - x;
        let deltaY = this.lastMouseY - y;
        this.lastMouseX = x;
        this.lastMouseY = y;
        if (this.isMapMoved) {
            this.posX = this.posX - deltaX;
            this.svg.style.left = this.posX + "px";
            this.posY = this.posY - deltaY;
            this.svg.style.top = this.posY + "px";
        }
    }

    touchMove(event) {
        if (event.touches.length > 1) {
            return;
        }
        let x = event.touches[0].pageX;
        let y = event.touches[0].pageY;
        if (this.lastMouseX == undefined) {
            this.lastMouseX = x;
            this.lastMouseY = y;
            return;
        }
        let deltaX = this.lastMouseX - x;
        let deltaY = this.lastMouseY - y;
        this.lastMouseX = x;
        this.lastMouseY = y;
        if (this.isMapMoved) {
            this.posX = this.posX - deltaX;
            this.svg.style.left = this.posX + "px";
            this.posY = this.posY - deltaY;
            this.svg.style.top = this.posY + "px";
        }
    }
}

export default Map;