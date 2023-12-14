const mongoose = require("mongoose");

const CheckoutWOSchema = new mongoose.Schema(
  {
    UserRequest: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    Departement: {
      type: mongoose.Types.ObjectId,
      ref: "Departement",
    },
    NamaBarang: {
      type: String,
      minlength: 5,
      maxlength: 50,
    },
    KodeBarang: {
      type: String,
      minlength: 5,
      maxlength: 50,
    },
    Permasalahan: {
      type: String,
      minlength: 5,
      maxlength: 50,
    },
    StatusWO: {
      type: String,
      enum: ["Approve", "Belum Approve"],
      default: "Belum Approve",
    },
    UserApprove: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    otp: {
      type: String,
    },
    Date_RequestWO: {
      type: Date,
    },
    Tindakan: {
      type: String,
      minlength: 5,
      maxlength: 50,
    },
    GantiSparepart: {
      type: String,
      minlength: 5,
      maxlength: 50,
    },
    StatusPengerjaan: {
      type: String,
      enum: ["Pending", "OnProgress", "Close"],
      default: "Pending",
    },
    HeadIT: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    StaffIT: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    Date_CompletionWO: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CheckoutWO", CheckoutWOSchema);
