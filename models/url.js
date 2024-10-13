const { DataTypes } = require("sequelize");
const { sequelize } = require("../connect");

const URL = sequelize.define(
  "URL",
  {
    shortId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    redirectURL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    visitHistory: {
      type: DataTypes.JSON, // Using JSON for MySQL
      allowNull: true,
      defaultValue: [], // Default to an empty array if no visits
    },
  },
  {
    timestamps: true,
  }
);

module.exports = URL;
