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
        zoomInButton.onclick = this.zoomIn;

        const zoomOutButton = document.createElement("button");
        zoomOutButton.innerHTML = "–";
        zoomOutButton.className = "nav-link bg-dark text-white border rounded";
        zoomOutButton.onclick = this.zoomOut;

        buttonsDiv.appendChild(zoomInButton);
        buttonsDiv.appendChild(zoomOutButton);
        this.map.appendChild(buttonsDiv);

        this.moveFunc = this.move.bind(this);

        this.map.addEventListener("mousedown", () => {
            this.map.addEventListener("mousemove", this.moveFunc);
        });

        this.map.addEventListener("mouseup", () => {
            this.map.removeEventListener("mousemove", this.moveFunc);
            this.lastMouseX = undefined;
            this.lastMouseY = undefined;
        });

        this.map.addEventListener("mouseleave", () => {
            this.map.removeEventListener("mousemove", this.moveFunc);
            this.lastMouseX = undefined;
            this.lastMouseY = undefined;
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

        document.body.onload = () => {
            let bbox = this.svg.getBBox();
            console.log(bbox);
            this.width = bbox.width * (window.innerHeight / bbox.height);
            this.height = bbox.height * (window.innerHeight / bbox.height);
            this.svg.setAttributeNS(null, "width", this.width);
            this.svg.setAttributeNS(null, "height", this.height);
            this.image.setAttributeNS(null, "width", this.width);
            this.image.setAttributeNS(null, "height", this.height);
            this.svg.style.left = (window.innerWidth - this.width) / 2 + "px";
            this.svg.style.top = (window.innerHeight - this.height) / 2 + "px";
            this.callback();
        }
    }

    updateSvgSize() {
        let deltaX = this.svg.getAttributeNS(null, "width") - Math.floor(this.width * this.zoom);
        let deltaY = this.svg.getAttributeNS(null, "height") - Math.floor(this.height * this.zoom);

        this.posX = this.posX + deltaX / 2;
        this.svg.style.left = this.posX + "px";
        this.posY = this.posY + deltaY / 2;
        this.svg.style.top = this.posY + "px";

        this.svg.setAttributeNS(null, "width", Math.floor(this.width * this.zoom));
        this.svg.setAttributeNS(null, "height", Math.floor(this.height * this.zoom));
        this.image.setAttributeNS(null, "width", Math.floor(this.width * this.zoom));
        this.image.setAttributeNS(null, "height", Math.floor(this.height * this.zoom));
    }

    zoomIn() {
        this.zoom += 0.1;
        this.updateSvgSize();
    }

    zoomOut() {
        this.zoom -= 0.1;
        this.updateSvgSize();
    }

    move(event) {
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

        this.posX = this.posX - deltaX;
        this.svg.style.left = this.posX + "px";
        this.posY = this.posY - deltaY;
        this.svg.style.top = this.posY + "px";
    }
}

export default Map;