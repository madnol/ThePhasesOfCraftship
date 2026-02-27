import { PubSubEventBus } from "@dddforum/bus";
import { DomainEvent } from "@dddforum/core";


const eventBus = new PubSubEventBus();

eventBus.initialize().then(() => {
  console.log('Connected');
  eventBus.subscribe('TestEvent', async (event: DomainEvent) => {
    console.log('test event!!!!', event);
  });
  
  eventBus.subscribe('AnotherTestEvent', async (event: DomainEvent) => {
    console.log('another test event!!!!', event);
  });
})
.catch((err) => {
  console.error(err)
})


// rabbitMQ.listen();
