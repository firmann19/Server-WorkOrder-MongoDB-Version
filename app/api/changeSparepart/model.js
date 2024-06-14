const mongoose = require("mongoose");

const ChangeSparepartSchema = new mongoose.Schema(
  {
    StaffITRequest: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    namaSparepart: {
      type: String,
      required: [true, "Nama sparepart harus diisi"],
      minlength: 3,
      maxlength: 50,
    },
    kodeSparepart: {
      type: String,
      required: [true, "Kode sparepart harus diisi"],
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
    alasanReject: {
      type: String,
      minlength: 5,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("changeSparepart", ChangeSparepartSchema);
