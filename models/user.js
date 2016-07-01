'use strict'

const db = require('../db')

module.exports = db.Model.extend({
	tableName: 'users',
	uuid: true,
	hasTimestamps: true,
	bcrypt: {
		field: 'password'
	},
	hidden: ['password'] //hide fields when transforming to json
})