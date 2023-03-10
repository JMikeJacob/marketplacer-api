require('dotenv').config();
global.config = require('./utils/config')();

const factory = require('./utils/factory')();

const repository = require('./repository/main.repository')();
const controller = require('./controller/main.controller')(repository);

factory.setRepository(repository);
factory.setController(controller);

controller.seedProducts();
const cli = require('./views/cli');
cli(controller);