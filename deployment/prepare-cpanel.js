#!/usr/bin/env node
// Automated cPanel deployment preparation script
// This script copies all necessary files for cPanel deployment

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing cPanel deployment files...');

// Ensure deployment directory exists
const deployDir = __dirname;
const publicSource = path.join(__dirname, '../dist/public');
const publicDest = path.join(deployDir, 'public');

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`❌ Source directory not found: ${src}`);
    return false;
  }
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  return true;
}

try {
  // Copy the latest React build to deployment/public
  console.log('📂 Copying React build files...');
  if (copyDir(publicSource, publicDest)) {
    console.log('✅ React build files copied successfully');
  } else {
    console.error('❌ Failed to copy React build files');
    process.exit(1);
  }
  
  // Verify required files exist
  const requiredFiles = [
    'package.json',
    'app.js',
    'public/index.html',
    'public/assets'
  ];
  
  console.log('🔍 Verifying deployment files...');
  for (const file of requiredFiles) {
    const filePath = path.join(deployDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} - OK`);
    } else {
      console.error(`❌ ${file} - MISSING`);
    }
  }
  
  // Create deployment summary
  const summary = {
    timestamp: new Date().toISOString(),
    files: fs.readdirSync(publicDest).length,
    size: getDirSize(publicDest),
    ready: true
  };
  
  fs.writeFileSync(
    path.join(deployDir, 'deployment-summary.json'), 
    JSON.stringify(summary, null, 2)
  );
  
  console.log('');
  console.log('🎉 cPanel deployment ready!');
  console.log('📁 Files prepared in: deployment/');
  console.log(`📊 Frontend files: ${summary.files}`);
  console.log(`💾 Total size: ${(summary.size / 1024 / 1024).toFixed(2)} MB`);
  console.log('');
  console.log('📋 Upload these files to cPanel:');
  console.log('   - package.json');
  console.log('   - app.js');
  console.log('   - public/ (entire folder)');
  
} catch (error) {
  console.error('❌ Deployment preparation failed:', error.message);
  process.exit(1);
}

function getDirSize(dirPath) {
  let size = 0;
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += getDirSize(filePath);
    } else {
      size += stats.size;
    }
  }
  
  return size;
}