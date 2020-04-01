const minecraft = require("./minecraft");
const express = require('express');
const app = express();

app.use(express.static('client'));

app.get('/state', function (req, res) {
    res.send(minecraft.getState());
});

app.post('/start', function (req, res) {
    minecraft.start().then(function () {
        res.send(minecraft.getState());
    });
});

app.post('/stop', function (req, res) {
    minecraft.stop().then(function () {
        res.send(minecraft.getState());
    });
});

app.post('/restart', function (req, res) {
    minecraft.restart().then(function () {
        res.send(minecraft.getState());
    });
});

app.listen(minecraft.port);