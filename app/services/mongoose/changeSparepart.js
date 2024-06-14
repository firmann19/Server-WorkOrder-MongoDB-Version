const ChangeSparepart = require("../../api/changeSparepart/model");
const User = require("../../api/user/model");
const { NotFoundError, BadRequestError } = require("../../errors");
const {
  RequestChangeSparepart,
  ApproveChangeSparepart,
  RejectedChangeSparepart,
} = require("../mail");
const { getEmailConfirmation } = require("../repository/checkoutRepository");

module.exports = {
  createChangeSparepart: async (req, res) => {
    const {
      StaffITRequest,
      namaSparepart,
      kodeSparepart,
      harga,
      jumlahOrder,
      alasan,
      HeadIT,
    } = req.body;

    const getEmail = await getEmailConfirmation({ HeadIT });

    const createChangeSparepart = await ChangeSparepart.create({
      StaffITRequest,
      namaSparepart,
      kodeSparepart,
      harga,
      jumlahOrder,
      alasan,
      HeadIT,
    });

    await RequestChangeSparepart(getEmail, createChangeSparepart);

    return createChangeSparepart;
  },

  getAllChangeSparepart: async (req, res) => {
    const { keyword } = req.query;

    let condition = {};

    if (keyword) {
      condition = {
        ...condition,
        namaSparepart: { $regex: keyword, $options: "i" },
      };
    }

    const result = await ChangeSparepart.find(condition).populate({
      path: "StaffITRequest",
      select: "_id nama",
    });

    return result;
  },

  getOneChangeSparepart: async (req, res) => {
    const { id } = req.params;

    const result = await ChangeSparepart.findOne({
      _id: id,
    })
      .populate({
        path: "StaffITRequest",
        select: "_id nama",
      })
      .populate({
        path: "HeadIT",
        select: "_id nama",
      });

    if (!result)
      throw new NotFoundError(`Tidak ada ChangeSparepart dengan id :  ${id}`);

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

  ApproveStatusPengajuan: async (req, res) => {
    const { id } = req.params;
    const { statusPengajuan } = req.body;

    if (!["Belum Diketahui", "Diterima"].includes(statusPengajuan)) {
      throw new BadRequestError("Status harus Belum Diketahui atau Diterima");
    }

    const checkStatusPengajuan = await ChangeSparepart.findOne({
      _id: id,
    }).populate("StaffITRequest");

    if (!checkStatusPengajuan)
      throw new NotFoundError(`Tidak ada nama sparepart dengan id :  ${id}`);

    //Dapatkan ID pengguna dari properti UserRequestWO
    const userId = checkStatusPengajuan.StaffITRequest;

    //Temukan pengguna yang sesuai berdasarkan ID pengguna
    const user = await User.findById(userId);

    if (!user)
      throw new NotFoundError(`Tidak ada pengguna dengan id :  ${userId}`);

    //Dapatkan email pengguna dari model User
    const userEmail = user.email;

    checkStatusPengajuan.statusPengajuan = statusPengajuan;

    const namaSparepart = checkStatusPengajuan.namaSparepart;
    const kodeSparepart = checkStatusPengajuan.kodeSparepart;

    await checkStatusPengajuan.save();

    //Kirim email ke pengaju jika StatusWO adalah "Diterima"
    if (statusPengajuan === "Diterima") {
      await ApproveChangeSparepart(userEmail, {
        namaSparepart: namaSparepart,
        kodeSparepart: kodeSparepart,
      });
    }

    return checkStatusPengajuan;
  },

  RejectStatusPengajuan: async (req, res) => {
    const { id } = req.params;
    const { statusPengajuan, alasanReject } = req.body;

    if (!["Belum Diketahui", "Ditolak"].includes(statusPengajuan)) {
      throw new BadRequestError("Status harus Belum Diketahui atau Ditolak");
    }

    if (statusPengajuan === "Ditolak" && !alasanReject) {
      throw new BadRequestError(
        "Alasan reject harus disertakan jika statusnya Ditolak"
      );
    }

    const checkStatusPengajuan = await ChangeSparepart.findOne({
      _id: id,
    }).populate("StaffITRequest");

    if (!checkStatusPengajuan)
      throw new NotFoundError(`Tidak ada nama sparepart dengan id :  ${id}`);

    //Dapatkan ID pengguna dari properti UserRequestWO
    const userId = checkStatusPengajuan.StaffITRequest;

    //Temukan pengguna yang sesuai berdasarkan ID pengguna
    const user = await User.findById(userId);

    if (!user)
      throw new NotFoundError(`Tidak ada pengguna dengan id :  ${userId}`);

    //Dapatkan email pengguna dari model User
    const userEmail = user.email;

    checkStatusPengajuan.statusPengajuan = statusPengajuan;

    if (statusPengajuan === "Ditolak") {
      checkStatusPengajuan.alasanReject = alasanReject;
    }

    const namaSparepart = checkStatusPengajuan.namaSparepart;
    const kodeSparepart = checkStatusPengajuan.kodeSparepart;

    await checkStatusPengajuan.save();

    //Kirim email ke pengaju jika StatusWO adalah "Ditolak"
    if (statusPengajuan === "Ditolak") {
      await RejectedChangeSparepart(userEmail, {
        namaSparepart: namaSparepart,
        kodeSparepart: kodeSparepart,
        alasanReject: alasanReject,
      });
    }

    return checkStatusPengajuan;
  },
};
