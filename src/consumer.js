/**
 * Consumidor de mensajes (nodo distribuido, patrón Observer).
 * Se suscribe a temas y recibe mensajes del broker a través del canal de red.
 * Cada consumidor escucha mensajes de forma asíncrona (simulando hilos).
 */

class Consumer {
  constructor(consumerId, channel) {
    this.consumer_id = consumerId;
    this._channel = channel;
    this._received = [];
    this._boundHandler = (msg) => this._received.push(msg);
  }

  startListening(durationMs = 5000) {
    this._channel.onMessage(this._boundHandler);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, durationMs);
    });
  }

  getReceivedCount() {
    return this._received.length;
  }

  getReceivedMessages() {
    return [...this._received];
  }
}

module.exports = { Consumer };
