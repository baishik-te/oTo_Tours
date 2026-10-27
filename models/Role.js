'use strict';

const { Model, DataTypes } = require('sequelize');
const crypto = require('crypto');

class Role extends Model {
  static initModel(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: () => crypto.randomUUID()
        },
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true
        },
        displayName: {
          type: DataTypes.STRING(100),
          field: 'display_name',
          allowNull: true
        },
        description: {
          type: DataTypes.STRING(255),
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'Role',
        tableName: 'roles',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    );
  }

  static associate(models) {
    this.hasMany(models.User, {
      foreignKey: 'role_id',
      as: 'users'
    });
  }

  /**
   * Helper to ensure the 3 default roles exist in the database
   */
  static async ensureDefaultRoles() {
    const defaultRoles = [
      {
        name: 'guest',
        displayName: 'Guest Visitor',
        description: 'Unverified guest user awaiting email OTP verification'
      },
      {
        name: 'user',
        displayName: 'Verified Rider',
        description: 'Active public rider account with full booking and profile privileges'
      },
      {
        name: 'admin',
        displayName: 'Administrator',
        description: 'System administrator with CMS and management privileges'
      }
    ];

    const rolesMap = {};
    for (const roleDef of defaultRoles) {
      let role = await this.findOne({ where: { name: roleDef.name } });
      if (!role) {
        role = await this.create({
          id: crypto.randomUUID(),
          ...roleDef
        });
      }
      rolesMap[roleDef.name] = role;
    }
    return rolesMap;
  }
}

module.exports = Role;
