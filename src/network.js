/**
 * Capa de red simulada (Patrón Proxy).
 * Actúa como intermediario entre nodos distribuidos, simulando envío/recepción
 * por la red sin acoplar directamente los componentes al transporte.
 */

const { EventEmitter } = require('events');

/**
 * Mensaje que circula entre nodos.
 */
class Message {
  constructor(topic, payload, senderId) {
    this.topic = topic;
    this.payload = payload;
    this.sender_id = senderId;
    this.timestamp = Date.now() / 1000;
  }
}

/**
 * Canal de red simulado (Proxy).
 * Encapsula la comunicación entre un nodo y el broker.
 */
class NetworkChannel {
  constructor(nodeId, brokerInbox) {
    this.node_id = nodeId;
    this._brokerInbox = brokerInbox;
    this._emitter = new EventEmitter();
  }

  send(topic, payload) {
    const msg = new Message(topic, payload, this.node_id);
    this._brokerInbox.push(msg);
  }

  /**
   * Registra un listener para recibir mensajes (patrón Observer).
   * @param {function(Message): void} callback
   */
  onMessage(callback) {
    this._emitter.on('message', callback);
  }

  /**
   * Entrega un mensaje a este nodo (llamado por el broker).
   */
  deliver(msg) {
    this._emitter.emit('message', msg);
  }
}

/**
 * Capa de red que mantiene los canales de cada nodo.
 * Permite al broker entregar mensajes al canal correcto (Proxy).
 */
class NetworkLayer {
  constructor() {
    this._channels = new Map();
  }

  register(nodeId, brokerInbox) {
    const channel = new NetworkChannel(nodeId, brokerInbox);
    this._channels.set(nodeId, channel);
    return channel;
  }

  getChannel(nodeId) {
    return this._channels.get(nodeId);
  }

  listNodes() {
    return [...this._channels.keys()];
  }
}

module.exports = { Message, NetworkChannel, NetworkLayer };
