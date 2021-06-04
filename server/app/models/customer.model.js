const { sequelize } = require("../config/db.config");

module.exports = (sequelize, Sequelize) => {
    const Customer = sequelize.define('customer', {
        customerId: {
            type: Sequelize.STRING,
            unique: true,
        },
        firstname: {
            type: Sequelize.STRING
        },
        lastname: {
            type: Sequelize.STRING
        },
        birthdate: {
            type: Sequelize.DATE,
        },
        testStartDate: {
            type: Sequelize.DATE,
        },
        department: {
            type: Sequelize.STRING,
        },
        jobTitle: {
            type: Sequelize.STRING,
        },
        phoneNumber: {
            type: Sequelize.STRING,
        },
        createdAt: {
            type: Sequelize.DATETIME,
        },
    });

    return Customer;
}