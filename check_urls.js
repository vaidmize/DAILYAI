const https = require('https');

const urls = [
    'https://n8n.srv1319269.hstgr.cloud/webhook/ua9RHnSousQqwp2M', // V3 Production (Target)
    'https://n8n.srv1319269.hstgr.cloud/webhook-test/ua9RHnSousQqwp2M', // V3 Test
    'https://n8n.srv1319269.hstgr.cloud/webhook/website-chat', // V2 Production
];

console.log("Checking Webhook Endpoints...");

urls.forEach(url => {
    https.get(url + '?text=Ping', (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            // Check if it's the "not registered" 404 or a real 404
            const isN8n404 = body.includes('not registered');
            console.log(`[${res.statusCode}] ${isN8n404 ? 'N8n "Not Registered"' : 'Other Response'} - ${url}`);
        });
    }).on('error', e => console.log(`[Net Error: ${e.message}] ${url}`));
});
