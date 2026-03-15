/**
 * Punto de entrada: simula un sistema de mensajería distribuida con
 * múltiples productores y consumidores, comunicados vía broker.
 * Uso: node src/main.js [--producers N] [--consumers N] [--messages N]
 */

const { MessageBroker } = require('./broker');
const { Consumer } = require('./consumer');
const { NetworkLayer } = require('./network');
const { Producer, runProducer } = require('./producer');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { producers: 2, consumers: 2, messages: 10 };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--producers' && args[i + 1]) opts.producers = parseInt(args[i + 1], 10);
    if (args[i] === '--consumers' && args[i + 1]) opts.consumers = parseInt(args[i + 1], 10);
    if (args[i] === '--messages' && args[i + 1]) opts.messages = parseInt(args[i + 1], 10);
  }
  return opts;
}

async function runSimulation(numProducers, numConsumers, numMessages) {
  const topics = ['ventas', 'soporte'];

  const brokerInbox = [];
  const network = new NetworkLayer();

  const broker = new MessageBroker(network, brokerInbox);
  broker.start();

  const consumers = [];
  for (let i = 0; i < numConsumers; i++) {
    const cid = `Consumer-${i + 1}`;
    const ch = network.register(cid, brokerInbox);
    const consumer = new Consumer(cid, ch);
    for (const topic of topics) {
      broker.subscribe(cid, topic);
    }
    consumers.push(consumer);
  }

  const producers = [];
  for (let i = 0; i < numProducers; i++) {
    const pid = `Producer-${i + 1}`;
    const ch = network.register(pid, brokerInbox);
    producers.push(new Producer(pid, ch));
  }

  const durationMs = Math.max(4000, numMessages * 80 + 1000);
  const consumerPromises = consumers.map((c) => c.startListening(durationMs));

  const producerPromises = producers.map((p, i) => {
    const topic = topics[i % topics.length];
    const messages = Array.from({ length: numMessages }, (_, j) => `[${p.producer_id}] msg-${j}`);
    return runProducer(p, topic, messages);
  });

  await Promise.all(producerPromises);
  await Promise.all(consumerPromises);

  await new Promise((r) => setTimeout(r, 500));

  const totalSent = producers.reduce((s, p) => s + p.getSentCount(), 0);
  const totalDelivered = broker.getMessageCount();

  console.log('\n--- Resultados de la simulación ---');
  console.log(`Productores: ${numProducers}, Consumidores: ${numConsumers}`);
  console.log(`Mensajes enviados por productores: ${totalSent}`);
  console.log(`Mensajes entregados por el broker: ${totalDelivered}`);
  for (const c of consumers) {
    console.log(`  ${c.consumer_id} recibió: ${c.getReceivedCount()} mensajes`);
  }
  broker.stop();
  console.log('--- Fin ---\n');
}

async function main() {
  const { producers, consumers, messages } = parseArgs();
  await runSimulation(producers, consumers, messages);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
