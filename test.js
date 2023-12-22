import { createClient } from 'redis';

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

try {
  await client.set('key', 'value');
  const value = await client.get('key');
  console.log(value);
  client.disconnect();
} catch (error) {
  console.log(error.message)
}