import $ from '@ampify/aQuery';
import delay from '@ampify/toolbox/delay';

const menu = () => {
  const btn = document.querySelector('#acb')
  const closeSearch = btn.cloneNode(true);

  closeSearch.id = 'close-search';
  closeSearch.classList.add('is-active');
  closeSearch.setAttribute('hidden', '');

  btn.parentNode.insertBefore(closeSearch, btn);

  $('#acb').on('click', (e) => {
    $(e.target).toggleClass('is-active');
    $('body').toggleClass('has-overlay');
    $('#aca').toggleClass('nav__search-button--hidden');
    $('#a').removeClass('js-full-search-active').toggleClass('js-nav-active');
    $('#close-search').hide();
  });

  $('#aca').on('click', (e) => {
    $('#aca').hide();
    $('#acb').hide();
    $('#a').removeClass('js-nav-active').toggleClass('js-full-search-active');
    $('body').toggleClass('has-overlay');
    $('#close-search').show();
  });

  $('#close-search').on('click', (e) => {
    $('#aca').show();
    $('#acb').show();
    $('body').removeClass('has-overlay');
    $('#a').removeClass('js-full-search-active');
    $('#close-search').hide();
    $('#acb').removeClass('is-active');
  });
}

export default () => {
console.log('@@@');

  menu();

  return { cssIgnore: $.cssIgnore() };
};