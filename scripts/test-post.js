import fetch from 'node-fetch';

async function testPost() {
  // Try to create a template via the local API
  const res = await fetch('http://localhost:3000/api/templates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // We need to bypass auth by somehow passing a session cookie, 
      // OR we can just hit the database directly to test Mongoose limits.
    },
    body: JSON.stringify({ name: 'Test Template' }),
  });
  
  console.log(res.status, await res.text());
}

testPost();
