const wkhtmltopdf = require('wkhtmltopdf')

module.exports = htmlToPdf = (html, options = {}) => {
  return new Promise((resolve, reject) => {
    wkhtmltopdf(html, options, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
