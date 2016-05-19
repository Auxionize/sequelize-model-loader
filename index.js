'use strict';
let path = require('path');
let fs = require('fs');

module.exports = function(Sequelize, config, dialect, baseDir, dirs){
    let sequelize = new Sequelize(config.db.dbName, config.db.user, config.db.pass, {
        host: config.db.host,
        dialect: 'postgres',
        timestamps: true,
    });

    function processDir(dir){
        console.log("-- Models in:", dir);
        fs.readdirSync(dir)
            .filter(function (file) {
                return file.indexOf('.') >0;
            })
            .forEach(function (file) {
                console.log("Loading Model:", file);
                var modulePath = path.join(dir, file);
                var model = require(modulePath)(sequelize);
                models[model.name] = model;
            });
    }


    let models = {};
    for(let dir of dirs){
        processDir(path.join(baseDir, 'lib'));
    }

    for(let m in models){
        if(models[m].associate){
            models[m].associate(models);
        }
    }
    models.sequelize = sequelize;

    return models;
}


