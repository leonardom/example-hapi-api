'use strict'

const Hapi = require('hapi')

const User = require('./models/user')

const server = new Hapi.Server()
server.connection({port: 8080})

server.route({
	method: 'POST',
	path: '/v1/users',
	handler: function(request, reply) {
		//forge cria instancia em memoria
		User.forge(request.payload)
			.save()
			.then( (user) => reply(user) )
			.catch( (err) => reply({error: err.detail}).code(409) )
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

