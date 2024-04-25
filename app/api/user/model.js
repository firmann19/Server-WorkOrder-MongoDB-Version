const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    image: {
      type: mongoose.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    nama: {
      type: String,
      required: [true, "nama user harus diisi"],
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email harus diisi"],
      minlength: 5,
      maxlength: 50,
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
      minlength: 8,
    },
    departement: {
      type: mongoose.Types.ObjectId,
      ref: "Departement",
      required: [true, "Departement harus diisi"],
    },
    group: {
      type: mongoose.Types.ObjectId,
      ref: "Group",
      required: [true, "Group harus diisi"],
    },
    posisi: {
      type: mongoose.Types.ObjectId,
      ref: "Posisi",
      required: [true, "Posisi harus diisi"],
    },
    role: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
      required: [true, "Role harus diisi"],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const User = this;
  if (User.isModified("password")) {
    User.password = await bcrypt.hash(User.password, 12);
  }
  next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  const User = this._update;
  if (User.password) {
    User.password = await bcrypt.hash(User.password, 12);
  }
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
