const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

// Get values from command line arguments
const args = process.argv.slice(2);

if (args.length < 4) {
  console.log('Usage: node generate-apple-jwt.js <TEAM_ID> <KEY_ID> <SERVICES_ID> <PATH_TO_P8_FILE>');
  console.log('\nExample:');
  console.log('  node generate-apple-jwt.js ABC123DEFG XYZ789 com.astromatch.ios.web ~/Downloads/AuthKey_XYZ789.p8');
  process.exit(1);
}

const TEAM_ID = args[0];
const KEY_ID = args[1];
const SERVICES_ID = args[2];
const PRIVATE_KEY_PATH = args[3];

console.log('Generating JWT with:');
console.log('  Team ID:', TEAM_ID);
console.log('  Key ID:', KEY_ID);
console.log('  Services ID:', SERVICES_ID);
console.log('  Key file:', PRIVATE_KEY_PATH);
console.log('');

// Read the private key
if (!fs.existsSync(PRIVATE_KEY_PATH)) {
  console.error('Error: Key file not found at:', PRIVATE_KEY_PATH);
  process.exit(1);
}

const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');

// Create the JWT
const token = jwt.sign(
  {
    iss: TEAM_ID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 180, // 6 months
    aud: 'https://appleid.apple.com',
    sub: SERVICES_ID,
  },
  privateKey,
  {
    algorithm: 'ES256',
    keyid: KEY_ID,
  }
);

console.log('Your Apple JWT Secret Key:');
console.log('================================');
console.log(token);
console.log('================================');
console.log('\nCopy this entire JWT and paste it into Supabase as the Secret Key.');

