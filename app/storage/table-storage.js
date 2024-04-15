const { DefaultAzureCredential } = require('@azure/identity')
const { TableClient, odata } = require('@azure/data-tables')
const config = require('../config/storage')

let tableServiceClient
let tableInitialised
const maxDate = new Date(8640000000000000)

if (config.useConnectionStr) {
  console.log('Using connection string for Table Client')
  tableServiceClient = TableClient.fromConnectionString(config.connectionStr, config.documentsTable, { allowInsecureConnection: true })
} else {
  console.log('Using DefaultAzureCredential for Table Client')
  tableServiceClient = new TableClient(`https://${config.storageAccount}.table.core.windows.net`, config.documentsTable, new DefaultAzureCredential({ managedIdentityClientId: process.env.AZURE_CLIENT_ID }))
}

const initialiseTables = async () => {
  console.log('Making sure table exists')
  await tableServiceClient.createTable()
  tableInitialised = true
}

const invertTimestamp = (timestamp) => {
  const inverted = `${maxDate - timestamp}`

  return inverted.padStart(19, '0')
}

const enrichResponse = (response) => ({
  ...response,
  PartitionKey: response.filename,
  RowKey: invertTimestamp(Date.now()),
  status: response.status,
  processingTries: response.processingTries,
})

const addResponse = async (response) => {
  tableInitialised ?? await initialiseTables()
  const enrich = enrichResponse(response)
  await tableServiceClient.createEntity(enrich)
}

const getResponses = async (filename) => {
  tableInitialised ?? await initialiseTables()
  const query = tableServiceClient.listEntities({
    queryOptions: {
      filter: odata`PartitionKey eq ${filename}`
    }
  })

  const responses = []

  for await (const entity of query) {
    responses.push(entity)
  }

  return responses
}

const getResponse = async (filename) => {
  tableInitialised ?? await initialiseTables()
  const responses = await getResponses(filename)

  if (responses.length === 0) {
    return null;
  }

  const mostRecentResponse = responses.reduce((prev, current) => {
    return (prev.timestamp > current.timestamp) ? prev : current
  })

  return mostRecentResponse
}

module.exports = {
  addResponse,
  getResponses,
  getResponse
}