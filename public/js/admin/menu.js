function sideMenu() {
  let sideBar = $("#side-bar");
  let contentOverlay = $("#content-overlay-id");
  let menuText = $(".menu-text");

  if (sideBar.hasClass("side-nav-close")) {
    sideBar.removeClass("side-nav-close");
    menuText.removeClass("d-none");
    sideBar.addClass("side-nav-open");
    contentOverlay.addClass("content-overlay");
    contentOverlay.removeClass("content-overlay-close");
  } else {
    sideBar.removeClass("side-nav-open");
    sideBar.removeClass("content-overlay");
    sideBar.addClass("side-nav-close");
    contentOverlay.addClass("content-overlay-close");
    menuText.addClass("d-none");
  }
}

$("#menu").click(function () {
  sideMenu();
});

// content overlay click

$("#content-overlay-id").click(function () {
  sideMenu();
});
