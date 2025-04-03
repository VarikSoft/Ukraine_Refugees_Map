let sideMenu;

function toggleSideMenu() {
  if (!sideMenu) {
    console.error('Side menu is missing from the DOM.');
    return;
  }
  sideMenu.classList.toggle('active');
  if (isSliderMenuActive) {
    setSliderPositionRelativeToSideMenu();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('navigationMenuToggle');
  const menuButton = document.getElementById('navigationMenuToggleButton');
  const menu = document.getElementById('menu');
  const menuContent = document.querySelector('.menu-content');
  const menuTrigger = document.getElementById('statisticsMenuButton');
  const sideMenu = document.getElementById('statisticsMenu');
  const closeButton = document.getElementById('statisticsMenuCloseButton');
  menuTrigger.addEventListener('click', toggleSideMenu);
  closeButton.addEventListener('click', toggleSideMenu);
  menuToggle.addEventListener('click', () => {
    const isMenuActive = menu.classList.contains('active');
    menu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    menuButton.classList.toggle('rotated');
    if (!isMenuActive) {
      menuContent.style.transitionDelay = '0.1s';
    } else {
      menuContent.style.transitionDelay = '0s';
    }
  });
  if (menuTrigger && closeButton && sideMenu) {
    menuTrigger.addEventListener('click', toggleSideMenu);
    closeButton.addEventListener('click', toggleSideMenu);
  } else {
    console.error('One or more elements are missing from the DOM.');
  }
});