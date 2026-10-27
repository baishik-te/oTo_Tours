'use strict';

const { Model, DataTypes } = require('sequelize');
const crypto = require('crypto');

class User extends Model {
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
          type: DataTypes.STRING(100),
          allowNull: false
        },
        email: {
          type: DataTypes.STRING(150),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true
          }
        },
        phone: {
          type: DataTypes.STRING(50),
          allowNull: true
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        role: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: 'guest' // 'guest', 'user', 'admin'
        },
        roleId: {
          type: DataTypes.UUID,
          field: 'role_id',
          allowNull: true
        },
        status: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: 'inactive' // 'inactive', 'active', 'suspended'
        },
        emailVerified: {
          type: DataTypes.BOOLEAN,
          field: 'email_verified',
          allowNull: false,
          defaultValue: false
        },
        otpCode: {
          type: DataTypes.STRING(20),
          field: 'otp_code',
          allowNull: true
        },
        otpExpiresAt: {
          type: DataTypes.DATE,
          field: 'otp_expires_at',
          allowNull: true
        },
        lastLoginAt: {
          type: DataTypes.DATE,
          field: 'last_login_at',
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    );
  }

  static associate(models) {
    if (models.Role) {
      this.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'roleDetails'
      });
    }
  }

  toSafeJSON() {
    const raw = this.toJSON ? this.toJSON() : { ...this };
    delete raw.password;
    delete raw.otpCode;
    delete raw.otpExpiresAt;
    delete raw.otp_code;
    delete raw.otp_expires_at;
    return raw;
  }
}

module.exports = User;
