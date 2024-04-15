const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  pollingInterval: Joi.number().default(10000), // 10 seconds
  maxProcessingTries: Joi.number().default(3)
})

// Build config
const config = {
  pollingInterval: process.env.POLLING_INTERVAL,
  maxProcessingTries: process.env.MAX_PROCESSING_TRIES,
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The processing config is invalid. ${result.error.message}`)
}

module.exports = result.value
