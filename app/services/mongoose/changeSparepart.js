const ChangeSparepart = require("../../api/changeSparepart/model");
const { NotFoundError, BadRequestError } = require("../../errors");
const { ApproveSparepart } = require("../mail");
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

    if (!namaSparepart) {
      throw new BadRequestError("Mohon Input Nama Sparepart");
    } else if (!harga) {
      throw new BadRequestError("Mohon Input Harga");
    } else if (!jumlahOrder) {
      throw new BadRequestError("Mohon Input Jumlah Order");
    } else if (!alasan) {
      throw new BadRequestError("Mohon Input alasan");
    }

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

    await ApproveSparepart(getEmail, createChangeSparepart);

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

    // Jika status event bukan draft ataupun published maka akan menampilkan message dari BadRequestError
    if (!["Ditolak", "Diterima"].includes(statusPengajuan)) {
      throw new BadRequestError("Status harus Ditolak atau Diterima");
    }

    const checkStatusPengajuan = await ChangeSparepart.findOne({ _id: id });

    if (!checkStatusPengajuan)
      throw new NotFoundError(`Tidak ada nama sparepart dengan id :  ${id}`);

    checkStatusPengajuan.statusPengajuan = statusPengajuan;

    await checkStatusPengajuan.save();

    return result;
  },
};
