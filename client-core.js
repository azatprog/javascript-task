'use strict';
const axios = require('axios');
const qs = require('querystring');
const chalk = require('chalk');

module.exports.execute = execute;
module.exports.isStar = true;

const apiRoot = 'http://localhost:8080';

const parseArgs = (args) => {
    const commands = args.slice(2, args.length);
    const comTempl = { 'command': commands[0] };
    for (let index = 1; index < commands.length; index++) {
        const element = commands[index];
        if (element.indexOf('from') > -1) {
            comTempl.from = element.split('=')[1];
        }
        if (element.indexOf('to') > -1) {
            comTempl.to = element.split('=')[1];
        }
        if (element.indexOf('text') > -1) {
            comTempl.text = element.split('=')[1];
        }
    }
    
    return comTempl;
}

const sendMsg = (params, body) => {
    const query = qs.stringify(params);
    return axios.post(`${apiRoot}/messages?${query}`, body)
        .then(res => res.data)
        .catch(error => {
            Promise.reject(error);
        });
};

const getMsgs = (params) => {
    const query = qs.stringify(params);
    return axios.get(`${apiRoot}/messages?${query}`)
        .then(response => response.data)
        .catch(error => {
            Promise.reject(error);
        });
}

const styleMsgs = (msgs) => {
    const redColor = chalk.hex('#f00');
    const greenColor = chalk.hex('#0f0');
    const styledMsgs = msgs.map(m => {
        let text = '';
        if (m.from) {
            text = text.concat(`${redColor('FROM')}: ${m.from}\n`);
        }
        if (m.to) {
            text = text.concat(`${redColor('TO')}: ${m.to}\n`);
        }
        text = text.concat(`${greenColor('TEXT')}: ${m.text}`);

        return text;
    });

    return styledMsgs.join('\n\n');
}

function execute() {
    // Внутри этой функции нужно получить и обработать аргументы командной строки
    const argObject = parseArgs(process.argv);
    if (!argObject.command) {
        return Promise.reject('Error. No command..');
    }
    if (argObject.command === 'send' && !argObject.text ) {
        return Promise.reject('Error. No text for send command..');
    }

    const params = {};
    if (argObject.from) {
        params.from = argObject.from;
    }
    if (argObject.to) {
        params.to = argObject.to;
    }

    if (argObject.command === 'send') {
        const body = { 'text': argObject.text };
        return sendMsg(params, body).then(msg => Promise.resolve(styleMsgs([msg])));
    } 
    if (argObject.command === 'list') {
        return getMsgs(params).then(msgs => Promise.resolve(styleMsgs(msgs)));
    }
    
    return Promise.reject('Error. Not allowed command..');
}
