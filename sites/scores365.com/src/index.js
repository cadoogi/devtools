import $ from '@ampify/aQuery';
import { lazyLoadMenu, lazyLoadSearch, lazyLoadHeaderDropdown, lazyLoadFlagsDropdown } from './lazyload';

//const base = '//localhost:10300';
const base = 'https://proxy.staging.ampify.io';

const json = {
  'autocomplete': base + '/scores365/autocomplete',
  'games': base + '/scores365/games'
};

const langIds = {"he":"2","en-us":"9","en-uk":"10","it":"12","es":"14","fr":"15","de":"16","ru":"21","ar":"27","es-mx":"29","pt":"30","pt-br":"31","tr":"33","id":"34","pl":"35","nl":"37","da":"42","jp":"57","th":"88","zh":"141","fa":"158","de-at":"193","fi":"194","no":"195","ms":"196","nl-be":"197","sv":"198","zh-tw":"199","fil-ph":"209","hi":"216","vi":"210","mm":"219","lo":"217"};

const getLangId = () => {
  const rx = new RegExp(`^\\/(${Object.keys(langIds).join('|')})\\/`);

  if (rx.test(location.pathname) && langIds[RegExp.$1]) {
    return langIds[RegExp.$1];
  }

  return 1;
}

const getBaseUrl = () => {
  return location.origin + location.pathname.replace(/\/league\/.*/, '');
}

const getRequest = () => {
  if (/\/league\/\d+\/results/.test(location.pathname)) return 'web/games/results';
  if (/\/league\/\d+\/fixtures/.test(location.pathname)) return 'web/games/fixtures';
  
  return 'web/games/current';
}

const getLeageId = () => {
  return /\/league\/(\d+)/.test(location.pathname) && RegExp.$1;
}

const initMenu = () => {
  const btn = document.querySelector('.button-component');
  const btnCompetitons = document.querySelector('#Competitons');
  const btnAbout = document.querySelector('#About');
  const menu = document.querySelector('.drawer-module-component').parentElement;
  const menuAbout = document.querySelector('#menu-about');
  const menuCompetitons = document.querySelector('#menu-competitions');
  const dir = document.querySelector('div[data-365-scores-settings]').getAttribute('dir');

  $.injectCss(`
    .menu-active { color: #FFF !important; }
    .menu-inactive { color: #7f97ab !important; }
  `);

  $(btn).on('click', () => {
    dir === 'rtl' ? $(menu).slideLeft() : $(menu).slideRight();
    $(':root').toggleClass('menu-open');
  });

  $(btnAbout).on('click', () => {
    $(btnCompetitons).removeClass('menu-active').addClass('menu-inactive');
    
    $(menuAbout).show();
    $(menuCompetitons).hide();

    $(btnAbout).removeClass('menu-inactive').addClass('menu-active');
  });

  $(btnCompetitons).on('click', () => {
    $(btnCompetitons).removeClass('menu-inactive').addClass('menu-active');

    $(menuAbout).hide();
    $(menuCompetitons).show();

    $(btnAbout).removeClass('menu-active').addClass('menu-inactive');
  });
}

const initNotSupported = () => {
  //hide add to favorites star + settings button (for now)
  $.injectCss(`
  .drawer-module-component > div > div:nth-child(3), .mega-header-module-mobile-component > div > img {
    display:none !important;
  }
  `);
}

const initHeader = () => {
  $.injectCss(`.injector._syxjc {max-width: none !important;}`);
}

const initHeaderDropdown = async () => {
  const dropdownOpened = document.querySelector('#dropdown-opened'); 
  const dropdownClosed = document.querySelector('#dropdown-closed'); 
  
  const btnOpen = dropdownClosed.querySelector('.dropdown-header-component');
  const btnClose = dropdownOpened.querySelector('.dropdown-header-component');

  const open = () => {
    $(dropdownClosed).hide();
    $(dropdownOpened).show();
  };

  const close = () => {
    $(dropdownClosed).show();
    $(dropdownOpened).hide();
  }

  $(btnOpen).on('click', open);
  $(btnClose).on('click', close);
}

const initFlagsDropdown = () => {
  const btn = document.querySelector('.footer-module-component .dropdown-header-component');
  const menu = document.querySelector('#flags-dropdown');

  $(btn).on('click', () => {
    $(menu).toggleVisibility();
  });
}

const initSearchAutoComplete = () => {
  const url = json.autocomplete +'/?url=' + encodeURIComponent(`web/competitions?langId=${getLangId()}&timezoneName=TIMEZONE_CODE&userCountryId=-1&appTypeId=5&sports=1`);
  const inp = document.querySelector('#search-field');
  const results = document.querySelector('#search-ac');
  const template = `
    <div class="search-widget-item-component _zdxht7">
      <div class="component _1sfhic">
        <a class="_1yrob35 list-item-component _1xrsrh0" href="/{{sportId}}/{{countryId}}/{{nameForURL}}/league/{{id}}">
          <img width="20" height="20" style="margin: 8px;" src="https://imagecache.365scores.com/image/upload/f_auto,w_60,h_60,c_limit,q_auto:eco,d_Countries:Round:4.png/Competitions/Light/{{id}}">
          <div class=" text-component">{{name}}</div>
        </a>
      </div>
    </div>`;
  
  $(inp).autoComplete({
    source: $.getJSON(url),
    minLength: 2,
    appendTo: results,
    classes: {
      'dialog': 'list-component _u52rfv'
    },
    template
  });
}

const initGames = () => {
  const url = json.games + `/?langId=${getLangId()}&url=` + encodeURIComponent(`${getRequest()}?langId=${getLangId()}&timezoneName=TIMEZONE_CODE&userCountryId=-1&appTypeId=5&competitions=${getLeageId()}`);
  const list = document.querySelector('.competition-scores-widget-group-matches-component').parentNode;
  const container = list.cloneNode();

  list.parentNode.replaceChild(container, list);

  $.injectCss(`.sk-circle { display: none; }`);
  
  const teamTemplate = (type) => `
    <div class="game-card-competitor-logo-wrap">
      <img
        src="https://imagecache.365scores.com/image/upload/f_auto,w_72,h_72,c_limit,q_auto:eco,d_Competitors:default1.png/Competitors/{{id}}"
        class="game-card-competitor-logo" width="24" height="24"
      >
      <img src="https://res.365scores.com/static/media/scores-placeholder.933f095e.svg" class="game-card-competitor-logo hide hide" width="24" height="24">
    </div>
    {{#isQualified}}<img class="game-card-competitor-qualified-star" style="visibility: visible;" src="https://res.365scores.com/static/media/star-active.3bc7a253.svg">{{/isQualified}}
    <div class="ellipsis game-card-competitor-qualified-name text-component {{#isQualified}}game-card-competitor-qualified-name-qualified{{/isQualified}}">
      {{#shortName}}{{shortName}}{{/shortName}}
      {{^shortName}}{{name}}{{/shortName}}
    </div>
    {{#redCards}}
    <div class="game-card-red-cards game-card-red-cards-${type}">
      <div class="game-card-red-cards-label game-card-red-cards-label-${type}"></div>
    </div>
    {{/redCards}}
  `;
  
  const gameTemplate = `
    <div class="component _1f12olq">
      <a class="_1yrob35 game-card-component _12rlxvb " href="${getBaseUrl()}/game/{{#homeCompetitor}}{{nameForURL}}{{/homeCompetitor}}-{{#awayCompetitor}}{{nameForURL}}{{/awayCompetitor}}/{{id}}">
        <div class="component _rmuslo ">
          <div class="game-card-status-badge">{{displayStatus}}</div>
        </div>
        <div class="game-card-content">
          <div class="game-card-competitor-container">
            {{#homeCompetitor}}${teamTemplate('home')}{{/homeCompetitor}}
          </div>

          <div class="game-card-content-score">
            {{#isEnded}}
              {{#homeCompetitor}}{{score}}{{/homeCompetitor}} - {{#awayCompetitor}}{{score}}{{/awayCompetitor}}
            {{/isEnded}}
            {{^isEnded}}
              {{time}}
            {{/isEnded}}
          </div>

          <div class="game-card-competitor-container game-card-competitor-container-away">
            {{#awayCompetitor}}${teamTemplate('away')}{{/awayCompetitor}}
          </div>
        </div>
      </a>
    </div>
  `;

  const template = `
    <div class="${list.firstElementChild.className}">
      <div style="display: flex; justify-content: space-between; margin: 1px 0px; flex: 1 1 0%; background-color: white; height: 36px;">
        <div style="flex: 1 1 0%; display: flex; align-items: center; margin-left: 16px; font-size: 14px; font-weight: 400;"></div>
        <div style="flex: 1 1 0%; display: flex; align-items: center; margin: 0px 8px; justify-content: flex-end; font-size: 12px; font-weight: 400;">{{date}}</div>
      </div>

      {{#games}}${gameTemplate}{{/games}}
    </div>`;

  $(container).ajaxList({
    url,
    template,
    height: 600,
    infinite: true
  });
}

export default async () => {
  console.log('LAST VER 1');

  await lazyLoadMenu();
  await lazyLoadSearch();
  await lazyLoadHeaderDropdown();
  await lazyLoadFlagsDropdown();

  initHeader();
  initHeaderDropdown();
  initFlagsDropdown();
  initGames();
  initMenu();
  initNotSupported();
  initSearchAutoComplete();

  return { cssIgnore: $.cssIgnore() };
};

export const postImages = async () => {
  const menuAbout = document.querySelector('#menu-about');

  menuAbout.setAttribute('hidden', '');
}