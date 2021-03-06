import { insertOverlay, removeOverlay } from './utils/utils';
import registerCallback from './utils/callbacks';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const emulateDevice = async device => {
  return new Promise(resolve => {
    registerCallback({
      key: 'emulate-device',
      cb: () => {
        resolve();
      }
    });

    window.postMessage(JSON.stringify({ action: 'emulate-device', device }), '*');
  });
};

const prepareCSS = () => {
  const sheets = [...document.styleSheets];

  sheets.forEach(sheet => {
    const node = sheet.ownerNode;

    if (sheet.href) {
      return node.setAttribute('href', sheet.href);
    }

    if (!node.innerText && sheet.cssRules.length) {
      let css = '';

      [...sheet.cssRules].forEach(rule => {
        css += rule.cssText;
      });

      if (css) {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));

        node.parentElement.insertBefore(style, node);
        node.remove();
      }
    }
  });
};

const prepareHTML = () => {
  const fixRelativePaths = () => {
    const icons = document.querySelectorAll('link[rel=icon]');
    icons.forEach(el => {
      if (el.href) {
        el.href = new URL(el.href, location).toString();
      }
    });
  
    const images = document.querySelectorAll('img');
    images.forEach(el => {
      const src = el.src;
  
      if (src && /^(?!data:)/.test(src)) {
        el.src = new URL(src, location).toString();
      }
    });
  
    const links = document.querySelectorAll('a');
    links.forEach(el => {
      const href = el.getAttribute('href');
  
      if (!href || /^\#/.test(href)) return;
  
      try {
        el.href = new URL(href, location).toString();
      } catch (e) {
        //invalid href
      }
    });
  };

  const removeScripts = () => {
    Array.from(document.scripts).forEach(s => {
      const allowedTypes = ['application/json', 'text/plain', 'application/ld+json'];
      if (!allowedTypes.includes(s.type)) s.remove();
    });
  };

  const removeLink = (rels = ['preload', 'amphtml']) => {
    Array.from(document.querySelectorAll('link')).forEach(s => {
      const attr = s.getAttribute('rel');
      if (attr && rels.includes(attr.trim().toLowerCase())) s.remove();
    });
  };

  removeScripts();
  removeLink();
  fixRelativePaths();
}

const setSizing = (size) => {
  const elements = [
    ...document.querySelectorAll('img, iframe, video'),
    ...document.querySelectorAll('[style]')
  ];

  elements.forEach(el => {
    el.setAttribute(`data-ampify-size-${size}`, JSON.stringify({
      w: Math.floor(Math.max(el.clientWidth, el.offsetWidth)),
      h: Math.floor(Math.max(el.clientHeight, el.offsetHeight)),
      style: el.getAttribute('style') || ''
    }));
  });
}

const insertBase = () => {
  const base = document.createElement('base');

  base.href = location.href;
  
  document.head.prepend(base);
}

const getHTMLForAmpify = () => {
  insertBase();

  let html;

  if (document.doctype)
    html = new XMLSerializer().serializeToString(document.doctype);
  if (document.documentElement)
    html += document.documentElement.outerHTML;

  return html;
}

(async () => {
  const settings = window.__ampify__settings || {};
  const config = window.__ampify__json || {};
  const { cssFilter = [], plugins = [], blockFiles = [], waitForElement } = config;

  for (const { name, options = {} } of plugins) {
    console.log(name, window[name]);

    const exec = window[name] && window[name].default || window[name];
    if (typeof exec !== 'function') continue;

    const { cssIgnore = [] } = (await exec(options)) || {};

    cssFilter.push(...cssIgnore);
  }

  console.log('after plugins: ', cssFilter);

  await emulateDevice('IPHONE-5');
  await delay(100);

  setSizing('small');
  //sanitaizeViewportMeta

  await emulateDevice('IPHONE-X');
  await delay(100);

  setSizing('large');
  //sanitaizeViewportMeta

  //postImage Hook
  for (const { name, options = {} } of plugins) {
    const exec = window[name] && window[name].postImages;
    if (typeof exec !== 'function') continue;

    const { cssIgnore = [] } = (await exec(options)) || {};

    cssFilter.push(...cssIgnore);
  }

  if (settings.isRunPluginsOnly) { 
    return window.postMessage(
      JSON.stringify({
        action: 'ampify-complete'
      }),
      '*'
    );
  }

  prepareCSS();
  prepareHTML();

  removeOverlay();

  const html = getHTMLForAmpify();

  insertOverlay();

  console.log('Sending html to Ampify  \n ==============================');

  window.postMessage(
    JSON.stringify({
      action: 'ampify-algo',
      url: location.href,
      html,
      cssFilter
    }),
    '*'
  );

  window.ampifyHTML = html;
})();