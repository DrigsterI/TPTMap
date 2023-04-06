class Map {
    zoom = 1;
    width;
    height;

    lastMouseX;
    lastMouseY;

    posX = 0;
    posY = 0;

    map;
    svg;
    image;

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

    main() {
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

        this.image.setAttributeNS("http://www.w3.org/1999/xlink", "href", mapUrl);

        this.svg.style.position = "relative";
        this.svg.appendChild(this.image);
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
            event.preventDefault();
            if (event.touches.length == 1) {
                this.isMapMoved = true;
            }
        });

        this.map.addEventListener("touchend", () => {
            this.isMapMoved = false;
            this.lastMouseX = undefined;
            this.lastMouseY = undefined;
        });

        this.map.addEventListener("ontouchcancel", () => {
            this.isMapMoved = false;
            this.lastMouseX = undefined;
            this.lastMouseY = undefined;
        });

        this.map.addEventListener("mousemove", this.mouseMove.bind(this));
        this.map.addEventListener("touchmove", this.touchMove.bind(this));

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

        document.body.onload = () => {
            let bbox = this.svg.getBBox();
            this.width = (bbox.width * (window.innerWidth / bbox.width));
            this.height = (bbox.height * (window.innerHeight / bbox.height))
            this.lastMouseX = window.innerWidth / 2;
            this.lastMouseY = window.innerHeight / 2;
            this.svg.setAttributeNS(null, "width", this.width);
            this.svg.setAttributeNS(null, "height", this.height);
            this.updateSvgSize();
            this.lastMouseX = undefined;
            this.lastMouseY = undefined;
            this.callback();
        }
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
        this.image.setAttributeNS(null, "width", Math.floor(this.width * this.zoom));
        this.image.setAttributeNS(null, "height", Math.floor(this.height * this.zoom));
    }

    zoomIn(zoomToCenter = false) {
        this.zoom += 0.1;
        this.updateSvgSize(zoomToCenter);
    }

    zoomOut(zoomToCenter = false) {
        this.zoom -= 0.1;
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