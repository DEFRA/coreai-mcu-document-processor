const { downloadFile } = require('../storage/blob-storage');
const { uploadDocument, updateDocumentMetadata } = require('../api/documents');
const { exts, mime } = require('./document-types');
const { sendGenerationRequest } = require('../messaging/generation-request');

const buildMetadataPayload = (fileName) => {
  return {
    fileName,
    uploadedBy: 'Jane Doe',
    documentType: 'file',
    source: 'import',
    sourceAddress: 'dummy',
    suggestedCategory: 'Farming',
    userCategory: 'Farming',
    targetMinister: 'dummy'
  }
}

const downloadAndProcess = async (filename) => {
  const buffer = await downloadFile(filename)
  console.log(`Downloaded ${filename} with ${buffer.length} bytes`)
  const { id } = await uploadDocument(buffer, mime[exts.DOCX]) 
  const metadataPayload = buildMetadataPayload(filename)
  await updateDocumentMetadata(id, metadataPayload)
  await sendGenerationRequest({ documentId: id, userPrompt: '', knowledge: [] })
}

module.exports = downloadAndProcess
