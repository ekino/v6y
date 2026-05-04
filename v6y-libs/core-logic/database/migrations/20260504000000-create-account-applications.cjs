'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('account_applications', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            account_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'accounts', key: 'id' },
                onDelete: 'CASCADE',
            },
            app_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'applications', key: 'id' },
                onDelete: 'CASCADE',
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

        await queryInterface.addIndex('account_applications', ['account_id', 'app_id'], {
            unique: true,
            name: 'account_applications_account_id_app_id_unique',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('account_applications');
    },
};
