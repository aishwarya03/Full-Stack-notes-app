/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('notes', table => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.text('content').notNullable();
        table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('notes');
};
