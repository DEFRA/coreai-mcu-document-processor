const { MessageReceiver } = require('ffc-messaging')
const { eventsSubscription } = require('../config/messaging')
const { processEvent } = require('./inbound/process-event')

let eventsReceiver

const start = async () => {
  const eventAction = message => processEvent(message, eventsReceiver)
  eventsReceiver = new MessageReceiver(eventsSubscription, eventAction)
  await eventsReceiver.subscribe()

  console.info('Ready to receive messages')
}

const stop = async () => {
  await eventsReceiver.closeConnection()
}

module.exports = { start, stop }
