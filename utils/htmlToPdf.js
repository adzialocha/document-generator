const puppeteer = require('puppeteer')

module.exports = htmlToPdf = async(html, options = {}) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(html)
  await page.pdf(options)
  await browser.close()
}
