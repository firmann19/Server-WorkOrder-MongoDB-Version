const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "role harus diisi"],
      minlength: 2,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", RoleSchema);
