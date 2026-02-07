const https = require('https');

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjZGYxOWIzNy04NjY5LTRiN2QtOTdjYi03YmI2MmM5MDUxNjIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzcwNDcyMTg1LCJleHAiOjE3NzMwMTA4MDB9.4LCGPX6TyixzEpPvJcH7IT7CVmHyjz1zEWS5hTVy03A';
const hostname = 'n8n.srv1319269.hstgr.cloud';
const apiPath = '/api/v1/workflows';

const options = {
    hostname: hostname,
    path: apiPath,
    method: 'GET',
    headers: {
        'X-N8N-API-KEY': apiKey
    }
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(body);
            const targetId = 'ua9RHnSousQqwp2M';
            const found = json.data.find(w => w.id === targetId);

            if (found) {
                console.log(JSON.stringify(found, null, 2));
            } else {
                console.log("Not found");
            }
        } catch (e) { console.error(e); }
    });
});
req.end();
