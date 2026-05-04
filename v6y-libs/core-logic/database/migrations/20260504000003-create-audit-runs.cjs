'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('audit_runs', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            app_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'applications', key: 'id' },
                onDelete: 'CASCADE',
            },
            triggered_at: {
                type: Sequelize.DATE,
            },
            completed_at: {
                type: Sequelize.DATE,
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'RUNNING', 'COMPLETED', 'FAILED'),
                defaultValue: 'PENDING',
            },
            triggered_by: {
                type: Sequelize.TEXT,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('audit_runs');
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_audit_runs_status";',
        );
    },
};
