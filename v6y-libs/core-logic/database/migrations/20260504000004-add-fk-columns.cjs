'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // audit_reports: add audit_run_id, module_id, audit_help_id, audit_status, score_status
        await queryInterface.addColumn('audit_reports', 'audit_run_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'audit_runs', key: 'id' },
            onDelete: 'SET NULL',
        });
        await queryInterface.addColumn('audit_reports', 'module_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'modules', key: 'id' },
            onDelete: 'SET NULL',
        });
        await queryInterface.addColumn('audit_reports', 'audit_help_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'audit_helps', key: 'id' },
            onDelete: 'SET NULL',
        });
        await queryInterface.addColumn('audit_reports', 'audit_status', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.addColumn('audit_reports', 'score_status', {
            type: Sequelize.TEXT,
            allowNull: true,
        });

        // dependencies: add module_id, status_help_id, status
        await queryInterface.addColumn('dependencies', 'module_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'modules', key: 'id' },
            onDelete: 'SET NULL',
        });
        await queryInterface.addColumn('dependencies', 'status_help_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'dependency_status_helps', key: 'id' },
            onDelete: 'SET NULL',
        });
        await queryInterface.addColumn('dependencies', 'status', {
            type: Sequelize.TEXT,
            allowNull: true,
        });

        // evolution: add module_id, evolution_help_id
        await queryInterface.addColumn('evolution', 'module_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'modules', key: 'id' },
            onDelete: 'SET NULL',
        });
        await queryInterface.addColumn('evolution', 'evolution_help_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'evolution_helps', key: 'id' },
            onDelete: 'SET NULL',
        });

        // keywords: add module_id
        await queryInterface.addColumn('keywords', 'module_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: 'modules', key: 'id' },
            onDelete: 'SET NULL',
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('audit_reports', 'audit_run_id');
        await queryInterface.removeColumn('audit_reports', 'module_id');
        await queryInterface.removeColumn('audit_reports', 'audit_help_id');
        await queryInterface.removeColumn('audit_reports', 'audit_status');
        await queryInterface.removeColumn('audit_reports', 'score_status');

        await queryInterface.removeColumn('dependencies', 'module_id');
        await queryInterface.removeColumn('dependencies', 'status_help_id');
        await queryInterface.removeColumn('dependencies', 'status');

        await queryInterface.removeColumn('evolution', 'module_id');
        await queryInterface.removeColumn('evolution', 'evolution_help_id');

        await queryInterface.removeColumn('keywords', 'module_id');
    },
};
