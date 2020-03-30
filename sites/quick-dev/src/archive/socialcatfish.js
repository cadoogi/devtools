import $ from '@ampify/aQuery';
import delay from '@ampify/toolbox/delay';

const menu = () => {
  $('#menu').on('click', (e) => {
    $(e.target).toggleClass('active');
  });
}

const fixImages = () => {
  document.querySelectorAll('img:not([src])')
    .forEach(img => img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
}

const autoComplete = () => {
  const inp = document.querySelector('#full-name');

  inp.parentElement.nextElementSibling.innerHTML = '<input type="text" id="country" placeholder="Select a Country" name="country" maxlength="100"></input>';

  const url = 'https://proxy.staging.ampify.io/trvbox/autocomplete';

  $('#country').autocomplete({
    source: url
  });

  $.injectCss(`amp-autocomplete { width: 100%; }`);

}

export default () => {
  console.log('run plugin');

  menu();
  fixImages();
  autoComplete();

  return { cssIgnore: $.cssIgnore() };
};