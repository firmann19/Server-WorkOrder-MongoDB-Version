const mongoose = require("mongoose");

const PosisiSchema = new mongoose.Schema(
  {
    jabatan: {
      type: String,
      required: [true, "jabatan harus diisi"],
      minlength: 2,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posisi", PosisiSchema);
