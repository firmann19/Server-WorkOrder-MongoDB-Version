const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    namaGroup: {
      type: String,
      required: [true, "nama Group harus diisi"],
      minlength: 3,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", GroupSchema);
