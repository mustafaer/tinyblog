export const up = function (knex) {
  return knex.schema.createTable("confirmations", function (table) {
    table.bigIncrements();
    table.bigInteger("user_id").unsigned().notNullable();
    table
      .enu("confirmation_type", ["email", "phone", "password-reset"])
      .notNullable();
    table.string("confirmation_secret").notNullable().index();
    table.string("confirmation_code").notNullable();
    table.datetime("expires_at").notNullable();
    table.timestamps();
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("confirmations");
};
