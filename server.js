'use strict';
const Hapi = require('hapi');
const Good = require('good');
const Inert = require('inert');
const Path = require('path');
const Boom = require("boom");
const Joi = require("joi");
const _ = require('underscore');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

const server = new Hapi.Server();
server.connection({ port: 3000 });

server.route( {
    method  : 'GET',
    path    : '/',
    config:{
      handler : helloWorld,
      description: 'Hia',
      tags:['api','hia'],
      validate: {
        //params:{}
        //query:{}
        //payload:{}
      }
    }
});
function helloWorld(request, reply) {
    reply('Hello, world! <a href="/documentation">swagger documentation</a>');
}

//////////////
const swaggerOptions = {
  info: {
    'title': 'Test API Documentation','version': Pack.version
  }
};
server.register(
  [
    Vision,{
        'register': HapiSwagger,
        'options': swaggerOptions
    },
    {register: Inert, options:{}},
    {
      register: Good,
      options: {
        reporters: [{
          reporter: require('good-console'),
          events: {
          response: '*',
          log: '*'
          }
        }]
      }
    }
  ], 
  (err) => {
      if (err) {
        throw err; // something bad happened loading the plugin
      }
      server.start(() => {
        server.log('info', 'Server running at: ' + server.info.uri);
      });}
);