const { addResponse } = require('../storage/table-storage')
const downloadAndProcess = require('./download-and-process')
const status = require('./status')

const processIfValid = async (filename, processingTries) => {
  console.log(`Processing if valid ${filename}`)

  await downloadAndProcess(filename)

  await addResponse({
    filename,
    status: status.SUCCESS,
    processingTries
  })
}

module.exports = processIfValid
