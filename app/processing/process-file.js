const reprocessIfNeeded = require('./reprocess-if-needed')
const processIfValid = require('./process-if-valid')

const processFile = async (filename) => {
  try {
    console.log(`Processing ${filename}`)
    const reprocessed = await reprocessIfNeeded(filename)

    if (!reprocessed) {
      await processIfValid(filename, 1)
    }
  } catch (err) {
    console.error(`Error thrown processing ${filename}`)
    console.error(err)
  }
}

module.exports = processFile