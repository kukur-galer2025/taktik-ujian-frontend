const axios = require('axios');

async function test() {
  try {
    const token = '9|kM6AUt5tn32n4NYoCcu8JKCG9ahQknBC1iVitLl6360535aa';
    
    const analyticsRes = await axios.get('http://localhost:8000/api/user/analytics', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(JSON.stringify(analyticsRes.data.history, null, 2));
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
test();
