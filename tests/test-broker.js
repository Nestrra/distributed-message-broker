/**
 * Prueba básica del broker y la red.
 * Ejecutar: node tests/test-broker.js
 */

const { MessageBroker } = require('../src/broker');
const { NetworkLayer } = require('../src/network');

function testBrokerSubscribeDispatch() {
  const brokerInbox = [];
  const network = new NetworkLayer();
  const ch = network.register('C1', brokerInbox);
  const broker = new MessageBroker(network, brokerInbox);
  broker.subscribe('C1', 'test-topic');
  broker.start();

  const received = [];
  ch.onMessage((msg) => received.push(msg));

  brokerInbox.push({
    topic: 'test-topic',
    payload: 'hola',
    sender_id: 'P1',
    timestamp: Date.now() / 1000,
  });

  setTimeout(() => {
    broker.stop();
    const ok = received.length === 1 && received[0].payload === 'hola' && received[0].topic === 'test-topic';
    console.log(ok ? '✓ testBrokerSubscribeDispatch pasó' : '✗ testBrokerSubscribeDispatch falló');
    process.exit(ok ? 0 : 1);
  }, 100);
}

testBrokerSubscribeDispatch();
