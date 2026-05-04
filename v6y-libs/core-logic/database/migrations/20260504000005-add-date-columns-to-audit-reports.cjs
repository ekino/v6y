'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('audit_reports', 'date_start', {
            type: Sequelize.DATE,
            allowNull: true,
        });
        await queryInterface.addColumn('audit_reports', 'date_end', {
            type: Sequelize.DATE,
            allowNull: true,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('audit_reports', 'date_start');
        await queryInterface.removeColumn('audit_reports', 'date_end');
    },
};
