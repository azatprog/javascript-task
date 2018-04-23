'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const messages = [];

const filterByParams = (params) => {
    const keys = Object.keys(params);
    const filteredMsgs = [];
    if (keys.length > 0) {
        messages.filter(m => { 
            keys.forEach(key => {
                if (m[key] === params[key]) {
                    filteredMsgs.push(m);
                }
            });
            
        });
        return filteredMsgs;
    }
    return messages;
}

app.get('/messages/?', (req, res) => {
    const params = req.query;
    const msgFiltered = filterByParams(params);
    res.send(msgFiltered);
});

app.post('/messages/?', (req, res) => {
    const params = req.query;
    const msg = {...req.body};
    if (params.from) {
        msg.from = params.from ;
    }
    if (params.to) {
        msg.to = params.to ;
    }
    messages.push(msg)
    res.send(msg);
});

module.exports = app;
