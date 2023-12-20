const mongoose = require("mongoose");

const ChangeSparepartSchema = new mongoose.Schema(
  {
    userRequestWO: {
      type: String,
      required: [true, "Nama User harus diisi"],
      minlength: 3,
      maxlength: 50,
    },
    departementUser: {
      type: String,
      required: [true, "Nama Departement harus diisi"],
      minlength: 3,
      maxlength: 50,
    },
    namaSparepart: {
      type: String,
      required: [true, "Nama sparepart harus diisi"],
      minlength: 3,
      maxlength: 50,
    },
    harga: {
      type: String,
      required: [true, "Harga harus diisi"],
      minlength: 3,
      maxlength: 50,
    },
    jumlahOrder: {
      type: String,
      required: [true, "Jumlah order harus diisi"],
    },
    alasan: {
      type: String,
      required: [true, "Alasan harus diisi"],
      minlength: 5,
      maxlength: 50,
    },
    statusPengajuan: {
      type: String,
      enum: ["Belum Diketahui", "Ditolak", "Diterima"],
      default: "Belum Diketahui",
    },
    HeadIT: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("changeSparepart", ChangeSparepartSchema);
