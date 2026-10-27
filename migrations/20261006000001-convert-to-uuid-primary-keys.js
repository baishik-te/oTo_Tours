'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // =============================================
      // STEP 1 — CATEGORIES
      // =============================================

      // 1a. Add `category_code` to hold the old string id
      await queryInterface.addColumn('categories', 'category_code', {
        type: Sequelize.STRING(100),
        allowNull: true
      }, { transaction });

      // 1b. Copy current id → category_code
      await queryInterface.sequelize.query(
        `UPDATE categories SET category_code = id`,
        { transaction }
      );

      // 1c. Add a temporary UUID column
      await queryInterface.addColumn('categories', 'uuid_id', {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      }, { transaction });

      // =============================================
      // STEP 2 — LOCATIONS
      // =============================================

      await queryInterface.addColumn('locations', 'location_code', {
        type: Sequelize.STRING(100),
        allowNull: true
      }, { transaction });

      await queryInterface.sequelize.query(
        `UPDATE locations SET location_code = id`,
        { transaction }
      );

      await queryInterface.addColumn('locations', 'uuid_id', {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      }, { transaction });

      // =============================================
      // STEP 3 — TOURS  (handle FK first)
      // =============================================

      // 3a. Add `tour_code` to hold the old string id
      await queryInterface.addColumn('tours', 'tour_code', {
        type: Sequelize.STRING(100),
        allowNull: true
      }, { transaction });

      await queryInterface.sequelize.query(
        `UPDATE tours SET tour_code = id`,
        { transaction }
      );

      // 3b. Add temp UUID column for tours
      await queryInterface.addColumn('tours', 'uuid_id', {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      }, { transaction });

      // 3c. Add temp column to hold the new UUID FK for category
      await queryInterface.addColumn('tours', 'new_category_id', {
        type: Sequelize.UUID,
        allowNull: true
      }, { transaction });

      // 3d. Populate new_category_id by joining on old string id
      await queryInterface.sequelize.query(
        `UPDATE tours
         SET new_category_id = categories.uuid_id
         FROM categories
         WHERE tours.category_id = categories.id`,
        { transaction }
      );

      // =============================================
      // STEP 4 — DROP OLD PKs / FKs AND SWAP
      // =============================================

      // 4a. Drop the FK constraint on tours.category_id
      // (Sequelize-managed FK name convention)
      await queryInterface.sequelize.query(
        `ALTER TABLE tours DROP CONSTRAINT IF EXISTS tours_category_id_fkey`,
        { transaction }
      );

      // Remove the old index on tours.category_id (will recreate after swap)
      await queryInterface.sequelize.query(
        `DROP INDEX IF EXISTS idx_tours_category_id`,
        { transaction }
      );

      // --- CATEGORIES: swap id ---
      await queryInterface.sequelize.query(
        `ALTER TABLE categories DROP CONSTRAINT categories_pkey`,
        { transaction }
      );
      await queryInterface.removeColumn('categories', 'id', { transaction });
      await queryInterface.renameColumn('categories', 'uuid_id', 'id', { transaction });
      await queryInterface.sequelize.query(
        `ALTER TABLE categories ADD PRIMARY KEY (id)`,
        { transaction }
      );

      // --- LOCATIONS: swap id ---
      await queryInterface.sequelize.query(
        `ALTER TABLE locations DROP CONSTRAINT locations_pkey`,
        { transaction }
      );
      await queryInterface.removeColumn('locations', 'id', { transaction });
      await queryInterface.renameColumn('locations', 'uuid_id', 'id', { transaction });
      await queryInterface.sequelize.query(
        `ALTER TABLE locations ADD PRIMARY KEY (id)`,
        { transaction }
      );

      // --- TOURS: swap id + category_id ---
      await queryInterface.sequelize.query(
        `ALTER TABLE tours DROP CONSTRAINT tours_pkey`,
        { transaction }
      );
      await queryInterface.removeColumn('tours', 'id', { transaction });
      await queryInterface.renameColumn('tours', 'uuid_id', 'id', { transaction });
      await queryInterface.sequelize.query(
        `ALTER TABLE tours ADD PRIMARY KEY (id)`,
        { transaction }
      );

      // Swap category_id
      await queryInterface.removeColumn('tours', 'category_id', { transaction });
      await queryInterface.renameColumn('tours', 'new_category_id', 'category_id', { transaction });

      // =============================================
      // STEP 5 — RE-ADD FK + INDEXES + UNIQUE CONSTRAINTS
      // =============================================

      // FK on tours.category_id → categories.id
      await queryInterface.sequelize.query(
        `ALTER TABLE tours
         ADD CONSTRAINT tours_category_id_fkey
         FOREIGN KEY (category_id) REFERENCES categories(id)
         ON UPDATE CASCADE ON DELETE SET NULL`,
        { transaction }
      );

      // Indexes
      await queryInterface.addIndex('tours', ['category_id'], {
        name: 'idx_tours_category_id',
        transaction
      });

      // Unique index on the code columns for fast lookups
      await queryInterface.addIndex('categories', ['category_code'], {
        name: 'idx_categories_category_code',
        unique: true,
        transaction
      });

      await queryInterface.addIndex('locations', ['location_code'], {
        name: 'idx_locations_location_code',
        unique: true,
        transaction
      });

      await queryInterface.addIndex('tours', ['tour_code'], {
        name: 'idx_tours_tour_code',
        unique: true,
        transaction
      });

      // Make the code columns NOT NULL now that they're populated
      await queryInterface.changeColumn('categories', 'category_code', {
        type: Sequelize.STRING(100),
        allowNull: false
      }, { transaction });

      await queryInterface.changeColumn('locations', 'location_code', {
        type: Sequelize.STRING(100),
        allowNull: false
      }, { transaction });

      await queryInterface.changeColumn('tours', 'tour_code', {
        type: Sequelize.STRING(100),
        allowNull: false
      }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Reverse: drop FK
      await queryInterface.sequelize.query(
        `ALTER TABLE tours DROP CONSTRAINT IF EXISTS tours_category_id_fkey`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `DROP INDEX IF EXISTS idx_tours_category_id`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `DROP INDEX IF EXISTS idx_categories_category_code`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `DROP INDEX IF EXISTS idx_locations_location_code`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `DROP INDEX IF EXISTS idx_tours_tour_code`,
        { transaction }
      );

      // --- TOURS: restore old id from tour_code ---
      await queryInterface.sequelize.query(
        `ALTER TABLE tours DROP CONSTRAINT tours_pkey`,
        { transaction }
      );
      await queryInterface.renameColumn('tours', 'id', 'uuid_id', { transaction });
      await queryInterface.addColumn('tours', 'id', {
        type: Sequelize.STRING(100),
        allowNull: true
      }, { transaction });
      await queryInterface.sequelize.query(
        `UPDATE tours SET id = tour_code`,
        { transaction }
      );
      await queryInterface.changeColumn('tours', 'id', {
        type: Sequelize.STRING(100),
        allowNull: false
      }, { transaction });
      await queryInterface.sequelize.query(
        `ALTER TABLE tours ADD PRIMARY KEY (id)`,
        { transaction }
      );
      await queryInterface.removeColumn('tours', 'uuid_id', { transaction });
      await queryInterface.removeColumn('tours', 'tour_code', { transaction });

      // Restore category_id from categories.category_code
      await queryInterface.addColumn('tours', 'old_category_id', {
        type: Sequelize.STRING(100),
        allowNull: true
      }, { transaction });
      await queryInterface.sequelize.query(
        `UPDATE tours
         SET old_category_id = categories.category_code
         FROM categories
         WHERE tours.category_id = categories.id`,
        { transaction }
      );
      await queryInterface.removeColumn('tours', 'category_id', { transaction });
      await queryInterface.renameColumn('tours', 'old_category_id', 'category_id', { transaction });

      // --- CATEGORIES: restore ---
      await queryInterface.sequelize.query(
        `ALTER TABLE categories DROP CONSTRAINT categories_pkey`,
        { transaction }
      );
      await queryInterface.renameColumn('categories', 'id', 'uuid_id', { transaction });
      await queryInterface.addColumn('categories', 'id', {
        type: Sequelize.STRING(100),
        allowNull: true
      }, { transaction });
      await queryInterface.sequelize.query(
        `UPDATE categories SET id = category_code`,
        { transaction }
      );
      await queryInterface.changeColumn('categories', 'id', {
        type: Sequelize.STRING(100),
        allowNull: false
      }, { transaction });
      await queryInterface.sequelize.query(
        `ALTER TABLE categories ADD PRIMARY KEY (id)`,
        { transaction }
      );
      await queryInterface.removeColumn('categories', 'uuid_id', { transaction });
      await queryInterface.removeColumn('categories', 'category_code', { transaction });

      // --- LOCATIONS: restore ---
      await queryInterface.sequelize.query(
        `ALTER TABLE locations DROP CONSTRAINT locations_pkey`,
        { transaction }
      );
      await queryInterface.renameColumn('locations', 'id', 'uuid_id', { transaction });
      await queryInterface.addColumn('locations', 'id', {
        type: Sequelize.STRING(100),
        allowNull: true
      }, { transaction });
      await queryInterface.sequelize.query(
        `UPDATE locations SET id = location_code`,
        { transaction }
      );
      await queryInterface.changeColumn('locations', 'id', {
        type: Sequelize.STRING(100),
        allowNull: false
      }, { transaction });
      await queryInterface.sequelize.query(
        `ALTER TABLE locations ADD PRIMARY KEY (id)`,
        { transaction }
      );
      await queryInterface.removeColumn('locations', 'uuid_id', { transaction });
      await queryInterface.removeColumn('locations', 'location_code', { transaction });

      // Re-add FK on tours.category_id
      await queryInterface.sequelize.query(
        `ALTER TABLE tours
         ADD CONSTRAINT tours_category_id_fkey
         FOREIGN KEY (category_id) REFERENCES categories(id)
         ON UPDATE CASCADE ON DELETE SET NULL`,
        { transaction }
      );
      await queryInterface.addIndex('tours', ['category_id'], {
        name: 'idx_tours_category_id',
        transaction
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
