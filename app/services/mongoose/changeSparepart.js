const ChangeSparepart = require("../../api/changeSparepart/model");
const User = require("../../api/user/model");
const { NotFoundError, BadRequestError } = require("../../errors");
const { RequestChangeSparepart, ApproveChangeSparepart } = require("../mail");
const { getEmailConfirmation } = require("../repository/checkoutRepository");

module.exports = {
  createChangeSparepart: async (req, res) => {
    const {
      userRequestWO,
      departementUser,
      namaSparepart,
      harga,
      jumlahOrder,
      alasan,
      statusPengajuan,
      HeadIT,
    } = req.body;

    const getEmail = await getEmailConfirmation({ HeadIT });

    const createChangeSparepart = await ChangeSparepart.create({
      userRequestWO,
      departementUser,
      namaSparepart,
      harga,
      jumlahOrder,
      alasan,
      statusPengajuan,
      HeadIT,
    });

    await RequestChangeSparepart(getEmail, createChangeSparepart);

    return createChangeSparepart;
  },

  getAllChangeSparepart: async (req, res) => {
    const { keyword } = req.query;

    if (keyword) {
      condition = {
        ...condition,
        namaSparepart: { $regex: keyword, $options: "i" },
      };
    }

    const result = await ChangeSparepart.find();

    return result;
  },

  getOneChangeSparepart: async (req, res) => {
    const { id } = req.params;

    const result = await ChangeSparepart.findOne({
      _id: id,
    });

    if (!result)
      throw new NotFoundError(`Tidak ada ChangeSparepart dengan id :  ${id}`);

    return result;
  },

  updateChangeSparepart: async (req, res) => {
    const { id } = req.params;

    const {
      userRequestWo,
      departementUser,
      namaSparepart,
      harga,
      jumlahOrder,
      alasan,
      statusPengajuan,
      HeadIT,
    } = req.body;

    const check = await ChangeSparepart.findOne({
      namaSparepart,
      _id: { $ne: id },
    });

    if (check) throw new BadRequestError("nama sparepart duplikat");

    const result = await ChangeSparepart.findOneAndUpdate(
      { _id: id },
      {
        userRequestWo,
        departementUser,
        namaSparepart,
        harga,
        jumlahOrder,
        alasan,
        statusPengajuan,
        HeadIT,
      },
      { new: true, runValidators: true }
    );

    if (!result)
      throw new NotFoundError(`Tidak ada nama sparepart dengan id : ${id}`);

    return result;
  },

  deleteChangeSparepart: async (req, res) => {
    const { id } = req.params;

    const result = await ChangeSparepart.findOne({
      _id: id,
    });

    if (!result)
      throw new NotFoundError(`Tidak ada ChangeSparepart dengan id :  ${id}`);

    await result.remove();

    return result;
  },

  changeStatusPengajuan: async (req, res) => {
    const { id } = req.params;
    const { statusPengajuan } = req.body;

    if (!["Ditolak", "Diterima"].includes(statusPengajuan)) {
      throw new BadRequestError("Status harus Ditolak atau Diterima");
    }

    const checkStatusPengajuan = await ChangeSparepart.findOne({
      _id: id,
    }).populate("userRequestWO");

    if (!checkStatusPengajuan)
      throw new NotFoundError(`Tidak ada nama sparepart dengan id :  ${id}`);

    //Dapatkan ID pengguna dari properti UserRequestWO
    const userId = checkStatusPengajuan.userRequestWO;

    //Temukan pengguna yang sesuai berdasarkan ID pengguna
    const user = await User.findById(userId);

    if (!user)
      throw new NotFoundError(`Tidak ada pengguna dengan id :  ${userId}`);

    //Dapatkan email pengguna dari model User
    const userEmail = user.email;

    checkStatusPengajuan.statusPengajuan = statusPengajuan;

    const namaBarang = checkStatus.NamaBarang;

    await checkStatusPengajuan.save();

    //Kirim email ke pengaju jika StatusWO adalah "Diterima"
    if (StatusWO === "Diterima") {
      await ApproveChangeSparepart(userEmail, {
        NamaBarang: namaBarang,
      });
    }

    return checkStatusPengajuan;
  },
};
