const { MessageSender } = require('ffc-messaging')
const { generationTopic } = require('../config/messaging')

const createMessage = (data) => ({
  body: {
    document_id: data.documentId,
    user_prompt: data.userPrompt,
    knowledge: data.knowledge
  },
  type: 'uk.gov.defra.mcu.event.generation.requested',
  source: 'coreai-mcu-document-processor'
})

const sendGenerationRequest = async (data) => {
  console.log('Sending generation request', data)
  console.log('Generation topic', generationTopic)
  const sender = new MessageSender(generationTopic)

  const message = createMessage(data)

  await sender.sendMessage(message)
  await sender.closeConnection()
}

module.exports = {
  sendGenerationRequest
}
