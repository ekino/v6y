'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('applications', 'configuration', {
            type: Sequelize.JSON,
            allowNull: true,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('applications', 'configuration');
    },
};
