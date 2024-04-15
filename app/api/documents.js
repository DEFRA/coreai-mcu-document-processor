const { get, post, put } = require('./base')
const { documentsApi: config } = require('../config/api')

const baseUrl = config.baseUrl

const uploadDocument = async (document, contentType) => {
  const headers = {
    'Content-Type': contentType
  }
  console.log(`Uploading document with ${document.length} bytes`, `${baseUrl}/documents`)
  return post(`${baseUrl}/documents`, document, headers)
}

const updateDocumentMetadata = async (id, metadata) => {
  return put(`${baseUrl}/documents/${id}`, metadata)
}

module.exports = {
  uploadDocument,
  updateDocumentMetadata
}
