import $ from '@ampify/aQuery';
import delay from '@ampify/toolbox/delay';
import scrollElement from '@ampify/toolbox/scrollElement';

export const lazyLoadMenu = async () => {
  $.injectCss(`.temp-hidden { display: none !important; }`)

  //open menu
  const btn = document.querySelector('.button-component');

  btn.click();

  await delay(100);

  //about
  //const btnAbout = document.querySelector('#About'); for some reason id is not stable
  const btnAbout = document.querySelector('.drawer-module-component > div > div:last-child');
  btnAbout.id = 'About';

  btnAbout.click();

  await delay(50);

  const aboutContainer = document.querySelector('.drawer-module-component .drawer-module-component').firstElementChild;
  const about = aboutContainer.cloneNode(true);

  about.id = 'menu-about';
  about.classList.add('temp-hidden');

  aboutContainer.parentNode.appendChild(about);

  //await delay(20000);

  //competitions
  //const btnCompetitons = document.querySelector('#Competitons');
  const btnCompetitons = document.querySelector('.drawer-module-component > div > div:nth-child(2)');
  btnCompetitons.id = 'Competitons';

  btnCompetitons.click();

  await delay(250);

  const competitionsContainer = document.querySelector('.drawer-module-component .drawer-module-component').lastElementChild;

  competitionsContainer.id = 'menu-competitions';

  //carousel
  const carousel = document.querySelector('.suggestion-box-component').parentElement.parentElement.parentElement;

  await scrollElement({ el: carousel, dir: 'right', step: 50 });

  await delay(100);

  //locations scroll
  const scroll = document.querySelector('.drawer-module-component .drawer-module-component');

  await scrollElement({ el: scroll, dir: 'bottom' });

  await delay(100);

  about.classList.remove('temp-hidden');

  btn.click();

  await delay(50);
}

export const lazyLoadHeaderDropdown = async () => {
  const dropdown = document.querySelector('.dropdown-component'); 
  const btn = document.querySelector('.dropdown-header-component');
  
  dropdown.id = 'dropdown-closed';

  btn.click();

  await delay(10);

  const expanded = dropdown.cloneNode(true);
  expanded.id = 'dropdown-opened';

  btn.click();

  await delay(10);

  dropdown.parentNode.appendChild(expanded);

  $(expanded).hide();
}

export const lazyLoadFlagsDropdown = async () => {
  const btn = document.querySelector('.footer-module-component .dropdown-header-component');
  const dropdown = document.querySelector('.footer-module-component .dropdown-component');

  $.injectCss(`
    .footer-module-component .dropdown-component {
      z-index: 40;
    }

    .menu-open .footer-module-component .dropdown-component { display: none; }
  `);

  btn.scrollIntoView();
  btn.click();

  await delay(250);

  let menu = dropdown.querySelector('.list-component');

  await scrollElement({ el: menu, dir: 'bottom', step: 100 });

  await delay(350);

  menu.querySelectorAll('img').forEach(img => {
    img.setAttribute('layout', 'fixed');
    img.setAttribute('height', 20);
    img.setAttribute('width', 20);
  });

  menu = menu.cloneNode(true);
  menu.id = 'flags-dropdown';
  menu.setAttribute('hidden', '');

  btn.click();

  await delay(10);

  dropdown.appendChild(menu);
}

export const lazyLoadSearch = async () => {
  const container = document.querySelector('.search-widget-component').lastChild;
  const template = `
    <div id="ac-container" class="search-widget-component _wgmchy">
      <div class="search-widget-component _1jil3pj">
        <div id="search-ac" class="list-component _zdxht7">
        </div>
      </div>
    </div>`;

  $.injectCss(`._wgmchy {-webkit-box-direction: normal;
    -webkit-box-orient: vertical;
    display: flex;
    flex-direction: column;
  }
  
  ._1jil3pj {
    top: 26px;
    left: 0px;
    position: absolute;
    z-index: 40;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 4px 0px;
    width: 100%;
    background-color: rgb(255, 255, 255);
  }

  ._zdxht7 {
    width: 100%;
  }

  ._1yhn79w {
    font-size: 12px;
    font-weight: 500;
    border-bottom: 1px solid rgb(238, 238, 238);
    padding: 15px 10px 5px;
  }

  ._u52rfv {
    width: 100%;
    border-bottom: 2px solid rgb(223, 230, 238);
  }

  ._1xrsrh0 {
    -webkit-box-align: center;
    -webkit-box-pack: start;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-weight: 400;
    font-size: 13px;
    width: 100%;
    height: 40px;
    border-bottom: 2px solid rgb(223, 230, 238);
  }

  ._1sfhic {
    position: relative;
    height: 32px;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    border-right: none;
  }
  `);

  container.innerHTML = template;
}