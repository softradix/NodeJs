import bcrypt from "bcrypt";
import { saltRounds } from "../../config/keys";

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      org_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      first_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      phone_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "1=admin, 2=sales_repo, 3=club_owner",
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "1=Active, 0=In-Active",
      },
      invite_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "1=Accepted, 0=Pending",
      },
      email_verified: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.fn("current_timestamp"),
      },
      phone_verified: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.fn("current_timestamp"),
      },
      invite_token: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      reset_password_token: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      deleted_at: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          /**  password encryption **/
          if (user && user.password) {
            user.password = await bcrypt.hash(user.password, saltRounds);
          }
        },
        beforeBulkUpdate: async (user) => {
          if (user && user.attributes && user.attributes.password) {
            // eslint-disable-next-line no-param-reassign
            user.attributes.password = await bcrypt.hash(
              user.attributes.password,
              saltRounds
            );
          }
          if (user && user.attributes && user.attributes.email) {
            // eslint-disable-next-line no-param-reassign
            user.attributes.email = user.attributes.email.toLowerCase();
          }
        },
      },
    }
  );
  return users;
};
