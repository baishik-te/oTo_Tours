'use strict';

/**
 * Migration:
 * 1. Update foreign key `tours_category_id_fkey` on `tours.category_id` to ON DELETE CASCADE.
 * 2. Add `country`, `latitude`, `longitude` to `locations` table.
 * 3. Create `tour_locations` junction table with UUID PK, sequence, is_primary, and cascade foreign keys.
 * 4. Migrate any existing tours location string data into `tour_locations`.
 * 5. Drop redundant columns from `tours` (`category`, `category_tag`, `location`, `city`, `state`).
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Update tours.category_id foreign key constraint to ON DELETE CASCADE
      await queryInterface.sequelize.query(
        `ALTER TABLE tours DROP CONSTRAINT IF EXISTS tours_category_id_fkey`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE tours
         ADD CONSTRAINT tours_category_id_fkey
         FOREIGN KEY (category_id) REFERENCES categories(id)
         ON UPDATE CASCADE ON DELETE CASCADE`,
        { transaction }
      );

      // 2. Add extended columns to locations
      await queryInterface.addColumn('locations', 'country', {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: 'USA'
      }, { transaction });

      await queryInterface.addColumn('locations', 'latitude', {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('locations', 'longitude', {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true
      }, { transaction });

      // 3. Create tour_locations junction table
      await queryInterface.createTable('tour_locations', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        tour_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'tours',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        location_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'locations',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        sequence: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1
        },
        is_primary: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction });

      // Unique composite index on (tour_id, location_id)
      await queryInterface.addIndex('tour_locations', ['tour_id', 'location_id'], {
        name: 'idx_tour_locations_tour_location_unique',
        unique: true,
        transaction
      });

      await queryInterface.addIndex('tour_locations', ['tour_id'], {
        name: 'idx_tour_locations_tour_id',
        transaction
      });

      await queryInterface.addIndex('tour_locations', ['location_id'], {
        name: 'idx_tour_locations_location_id',
        transaction
      });

      // 4. Data Migration: Link existing tours to locations if matching
      await queryInterface.sequelize.query(
        `INSERT INTO tour_locations (id, tour_id, location_id, sequence, is_primary, created_at, updated_at)
         SELECT
           gen_random_uuid(),
           t.id AS tour_id,
           l.id AS location_id,
           1 AS sequence,
           true AS is_primary,
           CURRENT_TIMESTAMP,
           CURRENT_TIMESTAMP
         FROM tours t
         JOIN locations l ON (
           LOWER(TRIM(t.location)) = LOWER(TRIM(l.name))
           OR LOWER(TRIM(t.city)) = LOWER(TRIM(l.city))
           OR LOWER(TRIM(t.city)) = LOWER(TRIM(l.name))
         )
         ON CONFLICT (tour_id, location_id) DO NOTHING`,
        { transaction }
      );

      // 5. Drop redundant columns from tours safely inside transaction
      await queryInterface.sequelize.query(`ALTER TABLE tours DROP COLUMN IF EXISTS category`, { transaction });
      await queryInterface.sequelize.query(`ALTER TABLE tours DROP COLUMN IF EXISTS category_tag`, { transaction });
      await queryInterface.sequelize.query(`ALTER TABLE tours DROP COLUMN IF EXISTS location`, { transaction });
      await queryInterface.sequelize.query(`ALTER TABLE tours DROP COLUMN IF EXISTS city`, { transaction });
      await queryInterface.sequelize.query(`ALTER TABLE tours DROP COLUMN IF EXISTS state`, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Re-add columns to tours
      await queryInterface.addColumn('tours', 'category', {
        type: Sequelize.STRING(100),
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('tours', 'category_tag', {
        type: Sequelize.STRING(100),
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('tours', 'location', {
        type: Sequelize.STRING(255),
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('tours', 'city', {
        type: Sequelize.STRING(100),
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('tours', 'state', {
        type: Sequelize.STRING(50),
        allowNull: true
      }, { transaction });

      // Drop tour_locations table
      await queryInterface.dropTable('tour_locations', { transaction });

      // Remove location additions
      await queryInterface.removeColumn('locations', 'country', { transaction });
      await queryInterface.removeColumn('locations', 'latitude', { transaction });
      await queryInterface.removeColumn('locations', 'longitude', { transaction });

      // Reset FK back to SET NULL
      await queryInterface.sequelize.query(
        `ALTER TABLE tours DROP CONSTRAINT IF EXISTS tours_category_id_fkey`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE tours
         ADD CONSTRAINT tours_category_id_fkey
         FOREIGN KEY (category_id) REFERENCES categories(id)
         ON UPDATE CASCADE ON DELETE SET NULL`,
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
