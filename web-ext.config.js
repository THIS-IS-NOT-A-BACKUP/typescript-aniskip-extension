const manifestJson = require('./dist/manifest.json');

const startUrl = ['crunchyroll.com'];

switch (process.env.BROWSER) {
  case 'chromium':
    startUrl.push(
      'chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm'
    );
    break;
  case 'firefox':
    startUrl.unshift('addons.mozilla.org/en-US/firefox/addon/ublock-origin/');
    break;
  default:
    startUrl.push(
      'chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm'
    );
    break;
}

module.exports = {
  sourceDir: './dist',
  run: {
    startUrl,
    // If using Edge/Opera etc Chromium based browsers.
    //   chromiumBinary:
  },
  build: {
    filename: `${manifestJson.name.toLocaleLowerCase()}-${
      process.env.BROWSER
    }-${manifestJson.version}.zip`,
    overwriteDest: true,
  },
};
