const { getResponse, addResponse } = require('../storage/table-storage')
const { archiveFile, quarantineFile } = require('../storage/blob-storage')
const processingConfig = require('../config/processing')
const status = require('./status')

const reprocessIfNeeded = async (filename) => {
  const existingDocument = await getResponse(filename)
  if (existingDocument) {
    console.log(`${filename} already exists`)
    switch (existingDocument.status) {
      case status.INPROGRESS:
        await reprocess(filename, existingDocument)
        break
      case status.SUCCESS:
        await success(filename)
        break
      case status.FAILED:
        await failed(filename)
        break
      default:
        await unknown(filename)
        break
    }
    return true
  }
  return false
}

const addDocumentResponse = async (filename, status, processingTries) => {
  await addResponse({
    filename,
    status: status,
    processingTries
  
  })
}

const reprocess = async (filename, existingDocument) => {
  console.log('In progress status set, re-try processing')
  console.log(`Tried processing ${existingDocument.processingTries} times already`)

  if (existingDocument.processingTries >= processingConfig.maxProcessingTries) {
    console.log('Reached max re-tries, failed to process, quarantining')
    await quarantineFile(filename, filename)
    await addDocumentResponse(filename, status.FAILED, existingDocument.processingTries)
  } else {
    console.log('Reprocessing')
    await addDocumentResponse(filename, status.INPROGRESS, existingDocument.processingTries + 1)
  }
}

const success = async (filename) => {
  console.log('Previous processing success status set, archiving')
  await archiveFile(filename, filename)
}

const failed = async (filename) => {
  console.log('Previous processing failure status set, quarantining')
  await quarantineFile(filename, filename)
}

const unknown = async (filename) => {
  console.log('Previous processing unknown status set, quarantining')
  await quarantineFile(filename, filename)
}

module.exports = reprocessIfNeeded
