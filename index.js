'use strict'

const Hapi = require('hapi')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const Boom = require('Boom')

const User = require('./models/user')

const JWT_KEY = "ultrasecretkey"

const server = new Hapi.Server({
	debug: {
		request: ['error']
	}
})
server.connection({port: 8080})

//Hapi plugins
server.register(require('hapi-auth-jwt2'), (err) => {
	if (err) throw err;

	function validate(decoded, request, callback) {
		User.forge( { id: decoded.id })
		.fetch()
		.then( (user) => {
			if (user) {
				callback(null, true, user.toJSON())
			} else {
				callback(null, false)
			}
		})
		.catch( (err) => callback(err) )
	}

	server.auth.strategy('jwt', 'jwt', {
		key: JWT_KEY,
		validateFunc: validate
	})
})

server.route({
	method: 'POST',
	path: '/v1/users',
	handler: (request, reply) => {
		//forge cria instancia em memoria
		User.forge(request.payload)
			.save()
			.then( (user) => reply(user) )
			.catch( (err) => reply({error: err.detail}).code(409) )
	}, 
	config: {
		validate: {
			payload: Joi.object({
				email: Joi.string().email().required(),
				password: Joi.string().required()
			})
		}
	}
})

server.route({
	method: 'POST',
	path: '/v1/sessions',
	handler: (request, reply) => {
		let user

		User.forge({ email: request.payload.email })
			.fetch({ required: true }) //tells it needs to find
			.then( (found) => {
				user = found
				return user.compare(request.payload.password) 
			})
			.then( (valid) => {
				if (valid) {
					reply({
						token: jwt.sign({ id : user.id }, JWT_KEY)
					})
				} else {
					reply(Boom.unauthorized())
				}
			})
	},
	config: {
		validate: {
			payload: Joi.object({
				email: Joi.string().email().required(),
				password: Joi.string().required()
			})
		}
	}
})

server.route({
	method: 'GET',
	path: '/v1/sessions',
	handler: (request, reply) => {
		//reply(request.auth.credentials)
		reply(request.auth.credentials.email + ' Acesso autorizado!!')
	},
	config: {
		auth:  'jwt'
	}
})

server.start((err) => {

	if (err) {
		throw err
	}

	console.log('Server running at: ', server.info.uri)
})


// httpie para enviar request do terminal
// $ http -v GET http://localhost:8080

