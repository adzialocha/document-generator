const yaml = require('js-yaml')

module.exports = yamlToJson = str => {
  return new Promise((resolve, reject) => {
    try {
      resolve(yaml.load(str, 'utf-8'))
    } catch (err) {
      reject(err)
    }
  })
}
