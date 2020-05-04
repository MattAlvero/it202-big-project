const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
            
const listEl = document.querySelector('.mdc-drawer .mdc-list');
const mainContentEl = document.querySelector('.main-content');
const button = document.querySelector('.mdc-top-app-bar__navigation-icon')

button.addEventListener('click', (event) => {
  if (drawer.open)
      drawer.open = false;
  else {
      drawer.open = true;
  }
});