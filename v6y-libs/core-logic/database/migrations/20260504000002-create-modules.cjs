'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('modules', {
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
            branch: {
                type: Sequelize.TEXT,
            },
            path: {
                type: Sequelize.TEXT,
            },
            url: {
                type: Sequelize.TEXT,
            },
            status: {
                type: Sequelize.TEXT,
            },
            version: {
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

        await queryInterface.addIndex('modules', ['app_id', 'branch', 'path'], {
            unique: true,
            name: 'modules_app_id_branch_path_unique',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('modules');
    },
};
