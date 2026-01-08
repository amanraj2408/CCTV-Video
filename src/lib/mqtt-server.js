import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

import { initMQTT } from './mqtt-client.js';

// Start MQTT server
(async () => {
  try {
    await initMQTT();
    console.log('✓ MQTT server initialized and running');
    
    // Keep the process alive
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      process.exit(0);
    });
  } catch (error) {
    console.error('✗ Failed to start MQTT server:', error.message);
    process.exit(1);
  }
})();

