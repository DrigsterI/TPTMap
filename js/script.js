var lastClickFloor
var lastClickCase
function changeToActiveFloor(CurrentTab) { 
    if ( lastClickFloor === undefined) {
        lastClickFloor = document.getElementById("default_floor");
        lastClickFloor.classList.remove("active-right-tab");
     }
    else {
        lastClickFloor.classList.remove("active-right-tab");
    }
    CurrentTab.classList.add("active-right-tab");
    lastClickFloor=CurrentTab

  }
  function changeToActiveCase(CurrentTabCase) { 
    if ( lastClickCase === undefined) {
        lastClickCase = document.getElementById("default_case");
        lastClickCase.classList.remove("active-right-tab");
     }
    else {
        lastClickCase.classList.remove("active-right-tab");
    }
    CurrentTabCase.classList.add("active-right-tab");
    lastClickCase=CurrentTabCase

  }