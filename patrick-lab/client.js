'use strict';

const Client = require('./pages.js');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;

const pool = [];

ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command:${string.split(' ', 1)}`);
});

ee.on('/all', (client, string)=>{
  pool.forEach(c => c.socket.write(`${client.userName}: ${string}`));
});

server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nickname} has connected!\n`));

  socket.on('data', data => {
    let command = data.toString().split(' ').shift().trim();
    if(command.startsWith('/all')){
      ee.emit('/all', client, data.toString().split(' ').slice(1).join(' '));
    }

    ee.emit('default', client, data.toString());
  });
});


server.listen(PORT, () => console.log(`listening on: ${PORT}`));