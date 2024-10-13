export const up = function (knex) {
  return knex.schema.createTable("notifications", function (table) {
    table.increments();
    table
      .enu("type", ["Like", "Reshare", "Follow", "Reply", "Mention"])
      .notNullable();

    table.integer("user_id").unsigned().notNullable();
    table.integer("post_id").unsigned().nullable();
    table.integer("reply_id").unsigned().nullable();
    table.integer("count").unsigned().notNullable().defaultTo(1);
    table.boolean("is_read").notNullable().defaultTo(false);
    table.timestamps();

    table
      .foreign("user_id")
      .references("users.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("post_id")
      .references("posts.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .foreign("reply_id")
      .references("posts.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("notifications");
};
