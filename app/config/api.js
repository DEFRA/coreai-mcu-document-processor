const Joi = require('joi')

const schema = Joi.object({
  documentsApi: Joi.object({
    baseUrl: Joi.string().required()
  })
})

const config = {
  documentsApi: {
    baseUrl: process.env.DOCUMENTS_API_BASE_URL
  }
}

const { error, value } = schema.validate(config, { abortEarly: false })

if (error) {
  throw new Error(`The api config is invalid. ${error.message}`)
}

module.exports = value
