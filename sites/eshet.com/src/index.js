import $ from '@ampify/aQuery';

const initSearchIframe = () => {
  const container = document.querySelector('.one-wizard-wrapper');

  if (!container) { return; }

  const iframe = document.createElement('amp-iframe');

  $.injectCss(`.widget-iframe { border: none; }`);

  iframe.setAttribute('src', `https://www.eshet.com/wizard?url=${location.pathname}`);
  iframe.setAttribute('width', container.offsetWidth);
  iframe.setAttribute('height', container.offsetHeight);
  iframe.setAttribute('layout', 'responsive');
  
  iframe.setAttribute('resizable', '');
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');

  iframe.innerHTML = `
    <span placeholder class="amp-wp-iframe-placeholder"></span>
    <div overflow tabindex="45" role="button" aria-label="Read more">Read more</div>
  `;
  
  iframe.classList.add('widget-iframe');
  
  container.replaceWith(iframe);
}

export default () => {
  console.log('Ampify code here');

  initSearchIframe();

  return { cssIgnore: $.cssIgnore() };
};