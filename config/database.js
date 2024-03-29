const Sequelize = require('sequelize');
// Passing parameters separately
module.exports = new Sequelize('codehub', 'postgres', 'pg@ren01', {
    host: 'localhost',
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});