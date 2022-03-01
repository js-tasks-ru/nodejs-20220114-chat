const express = require('express');

const app = express();

app.use(express.static('public'));
app.use(express.json());

const clients = new Set();

app.get('/subscribe', async (req, res, next) => {
    try {
        const message = await new Promise(resolve => clients.add(resolve));
        res.send(message);
    } catch (err) {
        // res.send('internal error');
        next(err);
    }
});

app.post('/publish', (req, res, next) => {
    const message = req.body.message;
    if (!message) {
        res.send('no message');
        return;
    }

    clients.forEach(client => client(message));
    clients.clear();

    res.send('ok');
});

module.exports = app;
