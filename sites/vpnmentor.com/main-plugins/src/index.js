import $ from '@ampify/aQuery';
import delay from '@ampify/toolbox/delay';

const fixCss = () => {
  $.injectCss(`
    .post-text td { word-break: break-all; }
  `);
}

const lazyLoadImages = async () => {
  const lazyImages = document.querySelectorAll('img[data-src]:not([src])');

  lazyImages.forEach(img => img.src = img.dataset.src);

  await delay(500);
}

const menu = () => {
  const button = document.querySelector('.navbar-toggle');
  const menu = document.querySelector('#mobile_navigation');
  const subButtons = document.querySelectorAll('#menu-main-menu > li > a.dropdown-toggle');

  menu.classList.remove('collapse');

  $(button).on('click', (e) => {
    $(menu).slideToggle();
  });

  $(subButtons).on('click', (e) => {
    $(e.target.parentNode).toggleClass('open');
  });
};

const search = async () => {
  document.querySelector('#customecls').click();
}

const searchAutoComplete = () => {
  const input = document.querySelector('#search-box-home');
  const results = document.querySelector('#suggesstion-box-search');
  const url = 'https://proxy.staging.ampify.io/vpnmentor/autocomplete';
  const template = `<a href="{{url}}" class="list-group-item">{{name}}</a>`;

  $(results).show();

  $(input).autocomplete({
    source: url,
    minLength: 2,
    appendTo: results,
    itemsKey: 'items',
    classes: {
      'dialog': 'list-group'
    },
    template
  });
}

const initCarousel = () => {
  const sliders = document.querySelectorAll('.sidebar-mobile-wrap .slick-slider');

console.log('SLIDERS', sliders);

  sliders.forEach(slider => {
    $(slider).clone(true, { removeOrig: true }).carousel({
      slider: '.slick-track',
      next: '.slick-next',
      prev: '.slick-prev'
    });
  });
}

const extractGAEvents = (el) => {
  const whitelist = [/*'Category Sidebar menu', */'Top side menu', 'Lang Switcher', 'Sidebar Top Vendors', 'Article \\?']
  const rx = /clickedLink(External|Internal)\(\'(.*?)\',\s*\'(.*?)\'\)/i;
  const rxWL = new RegExp(`(${whitelist.join('|')})`, 'i');
  let category, name, label;

  if (rx.test(el.getAttribute('onclick'))) {
    category = RegExp.$1.toLowerCase() == 'external' ? 'click out' : 'click in';
    name = RegExp.$2;
    label = RegExp.$3;
  };

  if (rxWL.test(name)) { return { category, name, label } }
}


const initAnalytics = () => {
  //extract ua id from page
  const ga = 'UA-74495920-1';
  const aw = 'AW-947186489';

  const gtag = $.gtag({
    ga,
    aw
  });

  let events = [];

  //#1 - extract analytics events
  //#2 - limit events to max 70 (gtag in amp only supports this much)
  document.querySelectorAll('[onclick]').forEach(el => {
    const { category, name, label } = extractGAEvents(el) || {};

    if (category && name && label) {
      events.push({ el, category, name, label });
    }
  });

  //if more than 70 events, keep only article events
  if (events.length > 70) {
    events = events.filter(ev => /article ?/i.test(ev.name)).slice(0, 70);
  }

  for (const { el, category, name, label } of events) {
    gtag(el).event(name, {event_category: category, event_label: label});
  }

}

//this site changes the id of this input on resize for no reason - we'll prevent this.
const fixResizeBug = () => {
  const input = document.querySelector('#search-box-home');

  input.setAttribute = () => {};
}

export default async () => {
  fixCss();
  menu();
  search();
  searchAutoComplete();
  initCarousel();
  fixResizeBug();
  initAnalytics();

  await lazyLoadImages();

  return { cssIgnore: $.cssIgnore() };
};