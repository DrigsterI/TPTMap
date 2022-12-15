var lastClickFloor
var lastClickCase
var lastClickCaseMobile
var tabCase
var buildingCaseNow = A;
var CurrentTab = 1;
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
    changeFloorBuilding(CurrentTab)

  }
  function changeToActiveCase(CurrentTabCase, buttonCode) { 
    console.log(buttonCode);
    if ( lastClickCase === undefined) {
        lastClickCase = document.getElementById("default_case");
        lastClickCase.classList.remove("active-right-tab");
     }
    else {
        lastClickCase.classList.remove("active-right-tab");
    }
    if (buttonCode == 'A'){
        addActive = document.getElementById("default_mobile");
        addActive.classList.add("active-right-tab");
        removeActive = document.getElementById("secondary_mobile");
        removeActive.classList.remove("active-right-tab");
        removeActive = document.getElementById("secondary_case");
        removeActive.classList.remove("active-right-tab");
        buildingCaseNow = A;
    }
    else if (buttonCode == 'B'){
        addActive = document.getElementById("secondary_mobile");
        addActive.classList.add("active-right-tab");
        removeActive = document.getElementById("default_mobile");
        removeActive.classList.remove("active-right-tab");
        removeActive = document.getElementById("default_case");
        removeActive.classList.remove("active-right-tab");
        buildingCaseNow = B;
    }
    CurrentTabCase.classList.add("active-right-tab");
    lastClickCase=CurrentTabCase;

  }
  function changeToActiveMobileTab(CurrentTabCaseMobile, buttonCode) { 
    console.log(buttonCode);
    if ( lastClickCaseMobile === undefined) {
        lastClickCaseMobile = document.getElementById("default_mobile");
        lastClickCaseMobile.classList.remove("active-right-tab");
     }
    else {
        lastClickCaseMobile.classList.remove("active-right-tab");
    }
    if (buttonCode == 'A'){
        addActive = document.getElementById("default_case");
        addActive.classList.add("active-right-tab");
        removeActive = document.getElementById("secondary_case");
        removeActive.classList.remove("active-right-tab");
        removeActive = document.getElementById("secondary_mobile");
        removeActive.classList.remove("active-right-tab");
        buildingCaseNow = A;
    }
    else if (buttonCode == 'B'){
        addActive = document.getElementById("secondary_case");
        addActive.classList.add("active-right-tab");
        removeActive = document.getElementById("default_case");
        removeActive.classList.remove("active-right-tab");
        removeActive = document.getElementById("default_mobile");
        removeActive.classList.remove("active-right-tab");
        buildingCaseNow = B;
    }
    CurrentTabCaseMobile.classList.add("active-right-tab");
    lastClickCaseMobile=CurrentTabCaseMobile;

  }

  function changeFloorBuilding(CurrentTabCase) {
    alert(CurrentTab);
  }
 