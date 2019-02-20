const express = require('express');

const app = express();

app.use(require('./usuarios'));

app.use(require('./login'));

app.use(require('./categories'));

app.use(require('./products'));

app.use(require('./upload'));

app.use(require('./imgs'));

module.exports = app;