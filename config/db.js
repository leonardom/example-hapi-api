'use strict'

const knexfile = require('./knexfile')
const knex = require('knex')(knexfile[process.env.NODE_ENV || 'development'])

const bookshelf = require('bookshelf')(knex)
const bookshelfUuid = require('bookshelf-uuid')

bookshelf.plugin(bookshelfUuid)

module.exports = bookshelf

