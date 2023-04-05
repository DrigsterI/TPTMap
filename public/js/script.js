var pathname = String(window.location.pathname)
    var building = pathname.charAt(1)
    var floor = pathname.charAt(3)
function changeFloor(floor) {
    var htmlFloor = floor.innerHTML;
    floor.href = "/" + building + "/" + htmlFloor
}
function changeBuilding(building) {
    var htmlBuilding = building.innerHTML;
    building.href = "/" + htmlBuilding + "/" + floor
}