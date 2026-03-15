/**
 * Script de evaluación de desempeño 
 * Ejecuta varias configuraciones (productores, consumidores, mensajes)
 * y genera una tabla Markdown con los resultados.
 *
 * Uso (desde la raíz del proyecto): node tests/run-performance.js
 */

const { execSync } = require('child_process');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const mainPath = path.join(projectRoot, 'src/main.js');

const configs = [
  { producers: 2, consumers: 2, messages: 10 },
  { producers: 2, consumers: 2, messages: 20 },
  { producers: 3, consumers: 2, messages: 15 },
  { producers: 2, consumers: 4, messages: 15 },
  { producers: 3, consumers: 4, messages: 20 },
  { producers: 4, consumers: 3, messages: 25 },
  { producers: 5, consumers: 5, messages: 30 },
];

function runSimulation(producers, consumers, messages) {
  const start = Date.now();
  const cmd = `node "${mainPath}" --producers ${producers} --consumers ${consumers} --messages ${messages}`;
  const stdout = execSync(cmd, {
    cwd: projectRoot,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
  });
  const elapsedMs = Date.now() - start;

  const sentMatch = stdout.match(/Mensajes enviados por productores:\s*(\d+)/);
  const deliveredMatch = stdout.match(/Mensajes entregados por el broker:\s*(\d+)/);

  return {
    producers,
    consumers,
    messages,
    sent: sentMatch ? parseInt(sentMatch[1], 10) : null,
    delivered: deliveredMatch ? parseInt(deliveredMatch[1], 10) : null,
    tiempoMs: elapsedMs,
  };
}

function main() {
  console.log('# Resultados de pruebas de desempeño\n');
  console.log('Configuraciones ejecutadas desde la raíz del proyecto.\n');

  const results = [];
  for (const c of configs) {
    process.stderr.write(`Ejecutando P=${c.producers} C=${c.consumers} M=${c.messages}... `);
    const r = runSimulation(c.producers, c.consumers, c.messages);
    results.push(r);
    process.stderr.write(`${r.tiempoMs} ms\n`);
  }

  console.log('## Tabla de resultados\n');
  console.log('| Prueba | Productores | Consumidores | Mensajes | Enviados | Entregados | Tiempo (ms) |');
  console.log('|--------|-------------|--------------|----------|----------|------------|-------------|');
  results.forEach((r, i) => {
    console.log(`| ${i + 1} | ${r.producers} | ${r.consumers} | ${r.messages} | ${r.sent ?? '-'} | ${r.delivered ?? '-'} | ${r.tiempoMs} |`);
  });

  console.log('\n## Cómo usar en el informe (punto 7)\n');
  console.log('Copia la tabla anterior en tu informe bajo *Evaluación del desempeño y ajustes*.');
  console.log('Puedes pegar también el bloque siguiente como texto de apoyo:\n');
}

main();
