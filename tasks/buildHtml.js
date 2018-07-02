const chalk = require('chalk')
const nunjucks = require('nunjucks')

const {
  readFile,
  yamlToJson,
} = require('../utils')

function injectStyles(str, styles) {
  return str.replace('</head>', `<style>${styles}</style></head>`)
}

function generateHtml(srcFile, flavour, data) {
  const templateData = {
    flavour,
    ...data,
  }

  return Promise.resolve()
    .then(() => {
      return readFile(srcFile)
    })
    .then(template => {
      return new Promise((resolve, reject) => {
        nunjucks.renderString(template.toString(), templateData, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    })
}

module.exports = (templateDir, templateFile, flavourFile, yamlData, styles) => {
  console.log('')
  console.log(chalk.bold('✓ generate html file'))

  nunjucks.configure(templateDir, {
    noCache: true,
  })

  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(() => {
        return readFile(flavourFile)
      })
      .then(flavourYamlData => {
        return Promise.all([
          yamlToJson(flavourYamlData),
          yamlToJson(yamlData),
        ])
      })
      .then(results => {
        const [flavourData, data] = results

        return generateHtml(
          templateFile,
          flavourData,
          data,
        )
      })
      .then(html => {
        return injectStyles(html, styles)
      })
      .then(html => {
        console.log(chalk.green('... done!'))
        resolve(html)
      })
      .catch(err => {
        console.log(chalk.red('... task failed!'))
        reject(err)
      })
  })
}
