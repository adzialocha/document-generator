const chalk = require('chalk')
const sass = require('node-sass')

function convert(srcFile) {
  return new Promise((resolve, reject) => {
    sass.render({
      file: srcFile,
    }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result.css)
      }
    })
  })
}

module.exports = srcFile => {
  console.log('')
  console.log(chalk.bold('✓ generate styles'))

  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(() => {
        return convert(srcFile)
      })
      .then(css => {
        console.log(chalk.green('... done!'))
        resolve(css)
      })
      .catch(err => {
        console.log(chalk.red('... task failed!'))
        reject(err)
      })
  })
}
