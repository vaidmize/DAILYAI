const https = require('https');

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjZGYxOWIzNy04NjY5LTRiN2QtOTdjYi03YmI2MmM5MDUxNjIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzcwNDcyMTg1LCJleHAiOjE3NzMwMTA4MDB9.4LCGPX6TyixzEpPvJcH7IT7CVmHyjz1zEWS5hTVy03A';
const hostname = 'n8n.srv1319269.hstgr.cloud';
const workflowId = 'ua9RHnSousQqwp2M';
const apiPath = `/api/v1/workflows/${workflowId}`;

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: hostname,
            path: path,
            method: method,
            headers: {
                'X-N8N-API-KEY': apiKey,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body }));
        });

        req.on('error', (e) => reject(e));

        if (data) req.write(data);
        req.end();
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log(`Fixing activation for workflow ${workflowId}...`);

    try {
        // 1. Deactivate
        console.log("Deactivating...");
        const deactRes = await makeRequest('POST', `${apiPath}/activate`, JSON.stringify({ active: false }));
        console.log(`Deactivation Status: ${deactRes.statusCode}`);

        await delay(2000); // Wait 2 seconds

        // 2. Activate
        console.log("Re-activating...");
        const actRes = await makeRequest('POST', `${apiPath}/activate`, JSON.stringify({ active: true }));
        console.log(`Activation Status: ${actRes.statusCode}`);

        if (actRes.statusCode === 200) {
            console.log("Success! Try testing the URL now.");
        }

    } catch (e) {
        console.error(e);
    }
}

main();
