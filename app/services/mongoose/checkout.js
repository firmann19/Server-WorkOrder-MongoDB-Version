const Checkout = require("../../api/checkoutWO/model");
const { NotFoundError, BadRequestError } = require("../../errors");
const { verifMail, DiketahuiWO } = require("../mail");
const {
  getEmailApprove,
  getEmailConfirmation,
} = require("../repository/checkoutRepository");

module.exports = {
  createCheckout: async (req, res) => {
    const {
      UserRequest,
      Departement,
      NamaBarang,
      KodeBarang,
      Permasalahan,
      StatusWO,
      UserApprove,
    } = req.body;

    //Cek kondisi request body
    if (!NamaBarang) {
      throw new BadRequestError("Mohon Input Nama Peralatan");
    } else if (!KodeBarang) {
      throw new BadRequestError("Mohon Input Kode Peralatan");
    } else if (!Permasalahan) {
      throw new BadRequestError("Mohon Input Permasalahan");
    } else if (!UserApprove) {
      throw new BadRequestError("Mohon Input User Approve");
    }

    const getEmail = await getEmailApprove({ UserApprove });

    const createCheckout = await Checkout.create({
      NamaBarang,
      KodeBarang,
      Permasalahan,
      UserRequest,
      Departement,
      UserApprove,
      StatusWO,
      otp: Math.floor(Math.random() * 9999),
      Date_RequestWO: new Date(),
    });

    await verifMail(getEmail, createCheckout);

    return createCheckout;
  },

  getAllCheckout: async (req, res) => {
    const {keyword, Departement} = req.query;

    let condition = {}

    if (keyword) {
      condition = { ...condition, NamaBarang: { $regex: keyword, $options: "i" } };
    }

    if (Departement) {
      condition = { ...condition, Departement: Departement };
    }

    const result = await Checkout.find(condition)
      .populate({
        path: "UserApprove",
        select: "_id nama",
      })
      .populate({
        path: "UserRequest",
        select: "_id nama",
      })
      .populate({
        path: "Departement",
        select: "_id namaDepartement",
      })
      .populate({
        path: "HeadIT",
        select: "_id nama",
      })
      .populate({
        path: "StaffIT",
        select: "_id nama",
      });

    return result;
  },

  getOneCheckout: async (req, res) => {
    const { id } = req.params;

    const result = await Checkout.findOne({
      _id: id,
    })
      .populate({
        path: "UserApprove",
        select: "_id nama",
      })
      .populate({
        path: "UserRequest",
        select: "_id nama",
      })
      .populate({
        path: "Departement",
        select: "_id namaDepartement",
      })
      .populate({
        path: "HeadIT",
        select: "_id nama",
      })
      .populate({
        path: "StaffIT",
        select: "_id nama",
      });
    console.log("test", result);

    if (!result)
      throw new NotFoundError(`Tidak ada Checkout dengan id :  ${id}`);

    return result;
  },

  getCheckoutByIdUser: async (req, res) => {
    const { id } = req.user;

    const getCheckoutByIdUser = await Checkout.find({ UserRequest: id })
      .populate({
        path: "UserRequest",
        select: "_id nama",
      })
      .populate({
        path: "Departement",
        select: "_id namaDepartement",
      });

    return getCheckoutByIdUser;
  },

  updateCheckout: async (req, res) => {
    const { id } = req.params;
    const { Tindakan, GantiSparepart, HeadIT, StaffIT } = req.body;

    //Cek kondisi request body
    if (!Tindakan) {
      throw new BadRequestError("Mohon Input Nama Peralatan");
    } else if (!GantiSparepart) {
      throw new BadRequestError("Mohon Input Kode Peralatan");
    }

    const getEmailHeadIT = await getEmailConfirmation({ HeadIT });

    const result = await Checkout.findOneAndUpdate(
      { _id: id },
      {
        Tindakan,
        GantiSparepart,
        StaffIT,
        HeadIT,
        Date_CompletionWO: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!result)
      throw new NotFoundError(`Tidak ada checkout dengan id :  ${id}`);

    await DiketahuiWO(getEmailHeadIT, result);

    return result;
  },

  deleteCheckout: async (req, res) => {
    const { id } = req.params;

    const result = await Checkout.findOne({
      _id: id,
    });

    if (!result)
      throw new NotFoundError(`Tidak ada Checkout dengan id :  ${id}`);

    await result.remove();

    return result;
  },

  changeStatusWo: async (req, res) => {
    const { id } = req.params;
    const { otp } = req.body;

    const result = await Checkout.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          otp,
          StatusWO: "Approve",
        },
      },
      { new: true, runValidators: true }
    );

    if (!result)
      throw new NotFoundError(`Tidak ada WorkOrder dengan id :  ${id}`);

    return result;
  },

  changeStatusPengerjaan: async (req, res) => {
    const { id } = req.params;
    const { StatusPengerjaan } = req.body;

    if (!["Pending", "OnProgress"].includes(StatusPengerjaan)) {
      throw new BadRequestError("Status pengerjaan harus Pending, onProgress");
    }

    const checkStatusPengerjaan = await Checkout.findOne({ _id: id });

    if (!checkStatusPengerjaan)
      throw new NotFoundError(`Tidak ada WorkOrder dengan id :  ${id}`);

    checkStatusPengerjaan.StatusPengerjaan = StatusPengerjaan;

    await checkStatusPengerjaan.save();

    return checkStatusPengerjaan;
  },

  changeStatusProgress: async (req, res) => {
    const { id } = req.params;

    const result = await Checkout.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          StatusPengerjaan: "Close",
        },
      },
      { new: true, runValidators: true }
    );

    return result;
  },
};
