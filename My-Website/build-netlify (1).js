#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Building for Netlify deployment...');

// Run Vite build with Netlify config
try {
  execSync('npx vite build --config vite.config.netlify.ts', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  console.log('✅ Netlify build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('🚀 Ready for Netlify deployment!');