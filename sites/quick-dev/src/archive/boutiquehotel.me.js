import $ from '@ampify/aQuery';
import delay from '@ampify/toolbox/delay';


export default () => {
  console.log('@@@@@@@@@@');
  $('#main-content > div.top-bar > div > div.date-selector-container > div > form > div.dates > div.input-container.date-input.checkin > button').on('click', (e) => {
    $('#main-content > div.top-bar > div > div.date-selector-container > div').toggleClass('checkin-selected');
    $('#main-content > div.top-bar > div > div.date-selector-container > div > form > div.dates > div.dialog.dialog-dates').toggleClass('menu_open1');
    $('#main-content > div.top-bar > div > div.date-selector-container > div > form > button').toggleClass('btn-success');
    $('#main-content > div.top-bar > div > div.date-selector-container > div > span').toggleClass('menu_open1');
  });

  $('#__ampify__gv5xkU').on('click', (e) => {
    $('#main-content > div.top-bar > div > div.date-selector-container > div').toggleClass('checkin-selected');
    $('#main-content > div.top-bar > div > div.date-selector-container > div > form > div.dates > div.dialog.dialog-dates').toggleClass('menu_open1');
    $('#main-content > div.top-bar > div > div.date-selector-container > div > form > button').toggleClass('btn-success');
    $('#main-content > div.top-bar > div > div.date-selector-container > div > span').toggleClass('menu_open1');
  });

  $.injectCss(`
    .menu_open1 {display:block !important};

  `);

  return { cssIgnore: $.cssIgnore() };
};