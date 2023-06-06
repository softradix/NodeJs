"use strict";
const bcrypt = require("bcrypt");
async function hash(password) {
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      // queryInterface.bulkDelete('users', null, { truncate:true }),
      await queryInterface.bulkInsert(
        "users",
        [
          {
            id: 1,
            org_id: 1,
            first_name: "Admin",
            last_name: "Athletics",
            email: "admin@yopmail.com",
            password: await hash("123456"),
            role_id: 1,
            status: 1,
            invite_status: 1,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { truncate: true }
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
