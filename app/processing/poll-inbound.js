const storage = require('../storage/blob-storage')
const processFile = require('./process-file')

const pollInbound = async () => {
  const inboundFiles = await storage.getInboundFileList()

  for (const inboundFile of inboundFiles) {
    await processFile(inboundFile)
  }
}

module.exports = pollInbound