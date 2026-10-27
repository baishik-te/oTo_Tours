# oTo Tours Backend API

Production-ready Express.js & PostgreSQL REST API for oTo Tours.

---

## Database & Sequelize Migrations

The project uses JavaScript migration files with `up()` and `down()` methods managed by `sequelize-cli` and configured to use PostgreSQL.

### Migration Files (`migrations/`):
- `migrations/20261005000001-create-categories.js`
- `migrations/20261005000002-create-locations.js`
- `migrations/20261005000003-create-tours.js`

### Seeder Files (`seeders/`):
- `seeders/20261005000001-seed-initial-data.js`

---

## Sequelize CLI Migration Commands

```bash
# Run all pending migrations (up)
npx sequelize-cli db:migrate
# Or via npm
npm run db:migrate

# Rollback all migrations (down)
npx sequelize-cli db:migrate:undo:all
# Or via npm
npm run db:migrate:undo

# Seed initial database data
npx sequelize-cli db:seed:all
# Or via npm
npm run db:seed

# Rollback seed data
npx sequelize-cli db:seed:undo:all
# Or via npm
npm run db:seed:undo

# Run automated CRUD verification
npm run db:verify
```

---

## Running the Application

```bash
# Start server in development mode
npm run dev

# Run automated test suites (29 tests)
npm test
```

---

## Interactive Swagger UI Documentation

Swagger documentation with interactive testing is available at:

```text
http://localhost:5000/api-docs/
```

### Authorizing Admin APIs in Swagger UI:
1. Click the green **Authorize** button at the top right of the Swagger UI.
2. Enter the Admin API key:
   ```text
   oto_admin_secret_key_2026
   ```
3. Click **Authorize** and then **Close**.
4. Test any `GET`, `POST`, `PUT`, `PATCH`, or `DELETE` endpoints for Tours and Categories.