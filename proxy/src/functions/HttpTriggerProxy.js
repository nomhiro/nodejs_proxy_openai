const { app } = require('@azure/functions');
const https = require('https');
const url = require('url');

app.http('HttpTriggerProxy', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const targetUrl = url.parse(request.url).path;

        const options = {
            hostname: 'aoai-poc-eastus2-01.openai.azure.com', // 転送先のホスト名
            port: 443, // 転送先のポート
            path: targetUrl,
            method: request.method,
            headers: request.headers
        };

        const proxyReq = https.request(options, (proxyRes) => {
            let data = '';

            proxyRes.on('data', (chunk) => {
                data += chunk;
            });

            proxyRes.on('end', () => {
                context.res = {
                    status: proxyRes.statusCode,
                    headers: proxyRes.headers,
                    body: data
                };
            });
        });

        request.pipe(proxyReq, { end: true });

        proxyReq.on('error', (err) => {
            context.res = {
                status: 500,
                body: 'Something went wrong.'
            };
            console.error(err);
        });
    }
});