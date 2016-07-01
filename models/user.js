'use strict'

const db = require('../config/db')

module.exports = db.Model.extend({
	tableName: 'users',
	uuid: true,
	hasTimestamps: true
})