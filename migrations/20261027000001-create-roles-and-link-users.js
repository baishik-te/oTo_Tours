'use strict';

const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Create 'roles' table
      await queryInterface.createTable(
        'roles',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false
          },
          name: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true
          },
          display_name: {
            type: Sequelize.STRING(100),
            allowNull: true
          },
          description: {
            type: Sequelize.STRING(255),
            allowNull: true
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('NOW')
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('NOW')
          }
        },
        { transaction }
      );

      await queryInterface.addIndex('roles', ['name'], { unique: true, transaction });

      // 2. Seed initial standard roles
      const guestRoleId = crypto.randomUUID();
      const userRoleId = crypto.randomUUID();
      const adminRoleId = crypto.randomUUID();
      const now = new Date();

      await queryInterface.bulkInsert(
        'roles',
        [
          {
            id: guestRoleId,
            name: 'guest',
            display_name: 'Guest Visitor',
            description: 'Unverified guest user awaiting email OTP verification',
            created_at: now,
            updated_at: now
          },
          {
            id: userRoleId,
            name: 'user',
            display_name: 'Verified Rider',
            description: 'Active public rider account with full booking and profile privileges',
            created_at: now,
            updated_at: now
          },
          {
            id: adminRoleId,
            name: 'admin',
            display_name: 'Administrator',
            description: 'System administrator with CMS and management privileges',
            created_at: now,
            updated_at: now
          }
        ],
        { transaction }
      );

      // 3. Add `role_id` column to `users` table
      await queryInterface.addColumn(
        'users',
        'role_id',
        {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'roles',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        { transaction }
      );

      await queryInterface.addIndex('users', ['role_id'], { transaction });

      // 4. Update existing users to associate with correct role_id
      await queryInterface.sequelize.query(
        `UPDATE users 
         SET role_id = roles.id 
         FROM roles 
         WHERE users.role = roles.name`,
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('users', 'role_id', { transaction });
      await queryInterface.dropTable('roles', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
