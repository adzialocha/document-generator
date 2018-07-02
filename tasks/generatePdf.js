const chalk = require('chalk')

const {
  htmlToPdf,
  readFile,
  yamlToJson,
} = require('../utils')

module.exports = (html, optionsFilePath, output) => {
  console.log('')
  console.log(chalk.bold('✓ generate pdf file'))

  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(() => {
        return readFile(optionsFilePath)
      })
      .then(yaml => {
        return yamlToJson(yaml)
      })
      .then(options => {
        return htmlToPdf(html, { ...options, output })
      })
      .then(() => {
        console.log(chalk.green('... done!'))
        resolve()
      })
      .catch(err => {
        console.log(chalk.red('... task failed!'))
        reject(err)
      })
  })
}
