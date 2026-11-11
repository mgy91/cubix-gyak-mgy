const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

app.get('/', (req, res) => {
    res.json({
        app: "Cubix Test App",
        environment: ENV,
        version: "1.0.0"
    });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Fut a ${PORT} porton.`));