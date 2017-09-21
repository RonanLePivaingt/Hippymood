// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'Chipslock': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('#chipslock')
      .assert.elementCount('img', 1)
      .keys(browser.Keys.UP_ARROW)
      .keys(browser.Keys.UP_ARROW)
      .keys(browser.Keys.DOWN_ARROW)
      .keys(browser.Keys.DOWN_ARROW)
      .keys(browser.Keys.LEFT_ARROW)
      .keys(browser.Keys.RIGHT_ARROW)
      .keys(browser.Keys.LEFT_ARROW)
      .keys(browser.Keys.RIGHT_ARROW)
      .pause(3000)
      .click('#NESBtnB')
      .click('#NESBtnA')
      .pause(3000)
      .waitForElementVisible('.intro', 5000)
  },
  'Search from intro': function (browser) {
    browser
      .click('.actions a.md-button')
      .waitForElementVisible('#searchForm', 5000)
      .end()
  }
}
