// @flow

import glob from 'glob-promise'
import fs from 'fs'
import appPackage from '../app/package.json'

glob(__dirname + '/translations/**/*.json')
  .then((translations) => {
    let docs = []
    translations.forEach((translation) => {
      let messages = require(translation)
      messages.forEach((message) => {
        let doc = {
          "_id": message.id,
          "version": appPackage.version,
          "description": message.description,
          "defaultMessage": message.defaultMessage,
          "translation": message.defaultMessage,
          "locale": "en-US",
          "type": "translation"
        }
        docs.push(doc)
      })
    })
    fs.writeFileSync('app/assets/msgs/en-US.json', JSON.stringify(docs))
  })
  .catch((err) => {
    console.log(err)
  })
