// @flow

import glob from 'glob-promise'
import fs from 'fs'

glob(__dirname + '/app/**/*.json')
  .then((translations) => {
    let docs = []
    translations.forEach((translation) => {
      let messages = require(translation)
      messages.forEach((message) => {
        let doc = {
          "_id": message.id,
          "description": message.description,
          "defaultMessage": message.defaultMessage,
          "translation": message.defaultMessage,
          "locale": "en-US",
          "type": "translation"
        }
        docs.push(doc)
      })
    })
    fs.writeFileSync('app/shell/config/data.json', JSON.stringify(docs))
  })
  .catch((err) => {
    console.log(err)
  })
