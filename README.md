# Actividad 4: Tejiendo redes – Arquitectura de software entre hilos y nodos

Sistema de **mensajería distribuida** simulado en **Node.js**: broker central, productores y consumidores que interactúan de forma asíncrona, aplicando patrones Observer, Proxy y Mediator.

## Requisitos

- **Node.js** 14 o superior (sin dependencias externas; solo módulos nativos).

## Ejecución

```bash
cd Actividad4-Arquitectura-Distribuida
npm start
```

O directamente:

```bash
node src/main.js
```

Para pruebas de escalabilidad (más productores/consumidores):

```bash
node src/main.js --producers 3 --consumers 4 --messages 20
```

## Estructura del proyecto (Node.js)

```
Actividad4-Arquitectura-Distribuida/
├── README.md
├── package.json
├── GUIA-PASO-A-PASO.md       # Guía para realizar la actividad
├── src/
│   ├── main.js               # Punto de entrada y simulación
│   ├── broker.js             # Message Broker (Mediator)
│   ├── producer.js           # Productores (nodos)
│   ├── consumer.js           # Consumidores (Observers)
│   └── network.js            # Capa de red simulada (Proxy)
├── docs/
│   ├── diagrama-componentes.md
│   ├── diagrama-secuencia.md
│   ├── diagrama-despliegue.md
│   └── patrones-diseno.md
└── tests/
    └── test-broker.js
```

## Patrones de diseño utilizados

- **Mediator**: el Broker centraliza la comunicación entre productores y consumidores.
- **Observer (distribuido)**: los consumidores se suscriben a temas y reciben notificaciones vía eventos.
- **Proxy**: la capa de red (NetworkLayer/NetworkChannel) actúa como intermediario para enviar/recibir mensajes.

