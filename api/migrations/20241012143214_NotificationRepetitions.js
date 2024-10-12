export const up = function (knex) {
  return knex.schema.createTable("notifications_repetitions", function (table) {
    table.increments();
    table.integer("notification_id").unsigned().notNullable();
    table.integer("source_user_id").unsigned().notNullable();
    table.timestamps();

    table
      .foreign("notification_id")
      .references("notifications.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table
      .foreign("source_user_id")
      .references("users.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("notifications_repetitions");
};
