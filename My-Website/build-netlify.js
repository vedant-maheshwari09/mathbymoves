#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building for Netlify deployment...');

// Install dependencies first
console.log('Installing dependencies...');
try {
  execSync('npm ci', { stdio: 'inherit' });
} catch (error) {
  console.log('npm ci failed, trying npm install...');
  execSync('npm install', { stdio: 'inherit' });
}

// Create temporary HTML file for Netlify build
const netlifyHTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vedant Maheshwari - Chess National Master & Math Champion</title>
    <meta name="description" content="Professional chess coaching and AMC 8 preparation by National Master Vedant Maheshwari (2265 USCF). Expert instruction from a top 20 player for age 15 and competitive mathematics champion." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main-netlify.tsx"></script>
  </body>
</html>`;

// Write temporary HTML file
fs.writeFileSync('client/index-netlify.html', netlifyHTML);

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

// Clean up temporary file
if (fs.existsSync('client/index-netlify.html')) {
  fs.unlinkSync('client/index-netlify.html');
}

console.log('🚀 Ready for Netlify deployment!');
console.log('📁 Upload the dist/public folder to Netlify');