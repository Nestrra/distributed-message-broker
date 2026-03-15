/**
 * Productor de mensajes (nodo distribuido).
 * Envía mensajes al broker a través de la capa de red (Proxy).
 * Cada productor puede ejecutarse de forma asíncrona (simulando hilos).
 */

class Producer {
  constructor(producerId, channel) {
    this.producer_id = producerId;
    this._channel = channel;
    this._sentCount = 0;
  }

  publish(topic, payload) {
    this._channel.send(topic, payload);
    this._sentCount += 1;
  }

  getSentCount() {
    return this._sentCount;
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Ejecuta un productor: envía la lista de mensajes al tema dado.
 * @param {Producer} producer
 * @param {string} topic
 * @param {string[]} messages
 */
async function runProducer(producer, topic, messages) {
  for (const payload of messages) {
    producer.publish(topic, payload);
    await delay(50);
  }
}

module.exports = { Producer, runProducer };
