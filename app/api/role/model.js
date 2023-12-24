const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["User", "Staff IT", "Manager IT"],
      default: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", RoleSchema);
