const express = require('express');
const app = express();

const PORT = process.env.PORT || 4000;
const VERSION = process.env.APP_VERSION || 'nincs-megadva';
const ENV = process.env.NODE_ENV || 'development';

app.get('/', (req, res) => {
    res.json({
        project: "Cubix DevOps Szorgalmi Feladat",
        status: "Sikeresen fut",
        build_version: VERSION,
        environment: ENV,
        security: "Multi-stage build + Non-root user (node)"
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Szorgalmi app elindult a ${PORT} porton | Verzió: ${VERSION}`);
});
