#!/usr/bin/env node

/**
 * Video Dashboard - Quick Reference CLI
 * Run: node scripts/quick-ref.js
 */

const fs = require('fs');
const path = require('path');

const commands = {
  'setup': {
    title: '🔧 Setup & Installation',
    commands: [
      { cmd: 'npm install', desc: 'Install dependencies' },
      { cmd: 'cp .env.example .env.local', desc: 'Create environment config' },
      { cmd: 'npm run dev', desc: 'Start development server' },
      { cmd: 'npm run mqtt-server', desc: 'Start MQTT client' },
      { cmd: 'docker-compose up', desc: 'Start Docker services' }
    ]
  },
  'dev': {
    title: '💻 Development Commands',
    commands: [
      { cmd: 'npm run dev', desc: 'Development server on :3000' },
      { cmd: 'npm run build', desc: 'Production build' },
      { cmd: 'npm run start', desc: 'Start production server' },
      { cmd: 'npm run lint', desc: 'Run ESLint' }
    ]
  },
  'docker': {
    title: '🐳 Docker Commands',
    commands: [
      { cmd: 'docker-compose up', desc: 'Start all services' },
      { cmd: 'docker-compose down', desc: 'Stop all services' },
      { cmd: 'docker-compose logs -f', desc: 'View logs' },
      { cmd: 'docker-compose ps', desc: 'Show running services' }
    ]
  },
  'api': {
    title: '📡 API Endpoints',
    commands: [
      { cmd: 'GET /api/cameras', desc: 'List all cameras' },
      { cmd: 'POST /api/cameras', desc: 'Create camera' },
      { cmd: 'GET /api/cameras/[id]', desc: 'Get camera' },
      { cmd: 'PUT /api/cameras/[id]', desc: 'Update camera' },
      { cmd: 'DELETE /api/cameras/[id]', desc: 'Delete camera' },
      { cmd: 'GET /api/cameras/[id]/monitoring', desc: 'Get monitoring data' },
      { cmd: 'GET /api/cameras/[id]/alerts', desc: 'Get alerts' }
    ]
  },
  'mqtt': {
    title: '🔌 MQTT Topics',
    commands: [
      { cmd: 'cameras/{id}/status', desc: 'Camera status updates' },
      { cmd: 'cameras/{id}/alerts', desc: 'Alert notifications' },
      { cmd: 'cameras/{id}/monitoring', desc: 'Real-time metrics' }
    ]
  },
  'env': {
    title: '⚙️  Environment Variables',
    commands: [
      { cmd: 'MONGODB_URI', desc: 'MongoDB connection string' },
      { cmd: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', desc: 'Clerk public key' },
      { cmd: 'CLERK_SECRET_KEY', desc: 'Clerk secret key' },
      { cmd: 'MQTT_BROKER_URL', desc: 'MQTT broker address' },
      { cmd: 'MQTT_USERNAME', desc: 'MQTT username' },
      { cmd: 'MQTT_PASSWORD', desc: 'MQTT password' }
    ]
  }
};

function displayCategory(key) {
  const category = commands[key];
  if (!category) {
    console.log('❌ Unknown category');
    return;
  }

  console.log('\n' + '='.repeat(60));
  console.log(category.title);
  console.log('='.repeat(60) + '\n');

  category.commands.forEach((item, idx) => {
    console.log(`${idx + 1}. ${item.cmd}`);
    console.log(`   └─ ${item.desc}\n`);
  });
}

function displayHelp() {
  console.log('\n' + '='.repeat(60));
  console.log('🎥 Video Dashboard - Quick Reference');
  console.log('='.repeat(60) + '\n');
  console.log('Usage: node scripts/quick-ref.js [category]\n');
  console.log('Categories:\n');

  Object.keys(commands).forEach((key) => {
    console.log(`  • ${key} - ${commands[key].title}`);
  });

  console.log('\nExamples:');
  console.log('  node scripts/quick-ref.js setup');
  console.log('  node scripts/quick-ref.js dev');
  console.log('  node scripts/quick-ref.js api\n');
}

// Main
if (process.argv.length < 3) {
  displayHelp();
} else {
  const category = process.argv[2];
  displayCategory(category);
}
