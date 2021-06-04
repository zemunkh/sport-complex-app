const { sequelize, Sequelize } = require("../config/db.config");

module.exports = (sequelize ) => {
    const TimeLog = sequelize.define('timelog', {
        customerId: {
            type: Sequelize.STRING,
        },
        entryTime: {
            type: Sequelize.DATETIME,
        },
        exitTime: {
            type: Sequelize.DATETIME,
        },
        hallType: {
            type: Sequelize.STRING,
        },
        lockerNumber: {
            type: Sequelize.STRING,
        },
    });

    return TimeLog;
}