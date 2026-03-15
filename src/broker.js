/**
 * Message Broker (Patrón Mediator + Observer distribuido).
 * Centraliza la comunicación: recibe mensajes de productores y los entrega
 * a los consumidores suscritos a cada tema. Gestiona suscripciones (Observer).
 */

class MessageBroker {
  constructor(network, brokerInbox) {
    this._network = network;
    this._inbox = brokerInbox;
    this._subscriptions = new Map(); // topic -> Set(consumerId)
    this._running = false;
    this._intervalId = null;
    this._messageCount = 0;
  }

  _getSubscribers(topic) {
    if (!this._subscriptions.has(topic)) {
      this._subscriptions.set(topic, new Set());
    }
    return this._subscriptions.get(topic);
  }

  subscribe(consumerId, topic) {
    this._getSubscribers(topic).add(consumerId);
  }

  unsubscribe(consumerId, topic) {
    this._getSubscribers(topic).delete(consumerId);
  }

  _dispatch(msg) {
    const subscriberIds = [...this._getSubscribers(msg.topic)];
    for (const cid of subscriberIds) {
      const channel = this._network.getChannel(cid);
      if (channel) {
        channel.deliver(msg);
        this._messageCount += 1;
      }
    }
  }

  _runLoop() {
    while (this._inbox.length > 0) {
      const msg = this._inbox.shift();
      this._dispatch(msg);
    }
  }

  start() {
    this._running = true;
    this._intervalId = setInterval(() => this._runLoop(), 10);
  }

  stop() {
    this._running = false;
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  getMessageCount() {
    return this._messageCount;
  }
}

module.exports = { MessageBroker };
