import https from 'https';

function testLogin(email, password) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email, password });
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  try {
    // Try HTTP instead
    const http = await import('http');
    
    const data = JSON.stringify({ email: 'doctor1@caresync.com', password: 'Doctor@123' });
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        try {
          const json = JSON.parse(body);
          if (json.data?.token) {
            console.log('✓ Login successful!');
            console.log('Token:', json.data.token.slice(0, 20) + '...');
            console.log('User:', json.data.user);
          } else {
            console.log('Response:', body);
          }
        } catch {
          console.log('Response:', body);
        }
        process.exit(0);
      });
    });

    req.on('error', (e) => {
      console.error('✗ Request error:', e.message);
      process.exit(1);
    });

    req.write(data);
    req.end();
  } catch (e) {
    console.error('✗ Error:', e.message);
    process.exit(1);
  }
}

run();
