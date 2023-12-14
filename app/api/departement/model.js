const mongoose = require("mongoose");

const DepartementSchema = new mongoose.Schema(
  {
    namaDepartement: {
      type: String,
      required: [true, "nama departement harus diisi"],
      minlength: 2,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Departement", DepartementSchema);
