var lastClickFloor
var lastClickCase
var lastClickCaseMobile
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
  function changeToActiveCase(CurrentTabCase, buttonCode) { 
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
    }
    else if (buttonCode == 'B'){
        addActive = document.getElementById("secondary_mobile");
        addActive.classList.add("active-right-tab");
        removeActive = document.getElementById("default_mobile");
        removeActive.classList.remove("active-right-tab");
    }
    CurrentTabCase.classList.add("active-right-tab");
    lastClickCase=CurrentTabCase;

  }
  function changeToActiveMobileTab(CurrentTabCaseMobile, buttonCode) { 
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
    }
    else if (buttonCode == 'B'){
        addActive = document.getElementById("secondary_case");
        addActive.classList.add("active-right-tab");
        removeActive = document.getElementById("default_case");
        removeActive.classList.remove("active-right-tab");
        removeActive = document.getElementById("default_mobile");
        removeActive.classList.remove("active-right-tab");
    }
    CurrentTabCaseMobile.classList.add("active-right-tab");
    lastClickCaseMobile=CurrentTabCaseMobile;

  }