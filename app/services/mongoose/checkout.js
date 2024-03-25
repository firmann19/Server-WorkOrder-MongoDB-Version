const Checkout = require("../../api/checkoutWO/model");
const { NotFoundError, BadRequestError } = require("../../errors");
const { verifMail, DiketahuiWO, ApproveRejected } = require("../mail");
const {
  getEmailApprove,
  getEmailConfirmation,
  getEmailRejected,
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
    const { keyword, Departement } = req.query;

    let condition = {};

    if (keyword) {
      condition = {
        ...condition,
        NamaBarang: { $regex: keyword, $options: "i" },
      };
    }

    if (Departement) {
      condition = { ...condition, Departement: Departement };
    }

    const results = await Checkout.find(condition)
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
      })

    // Iterate through each result to calculate the duration
    const resultsWithDuration = results.map((result) => {
      // Calculate duration if Date_RequestWO and Date_CompletionWO exist
      if (result.Date_RequestWO && result.Date_CompletionWO) {
        const startTime = new Date(result.Date_RequestWO);
        const endTime = new Date(result.Date_CompletionWO);
        const durationInMilliseconds = endTime - startTime;
        // Convert duration to hours
        const millisecondsPerDay = 1000 * 60 * 60;
        const days = Math.floor(durationInMilliseconds / millisecondsPerDay);
        const remainingMilliseconds =
          durationInMilliseconds % millisecondsPerDay;
        const hours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));
        const minutes = Math.floor(
          (remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor(
          (remainingMilliseconds % (1000 * 60)) / 1000
        );

        // Adding duration to the result object
        return {
          ...result.toObject(),
          duration: {
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
          },
        };
      } else {
        // If either Date_RequestWO or Date_CompletionWO is missing, set duration to null
        return {
          ...result.toObject(),
          duration: null,
        };
      }
    });

    return resultsWithDuration;
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

  getCheckoutByDepartementUser: async (req, res) => {
    const { departement } = req.user;

    const getCheckoutByDepartementUser = await Checkout.find({
      Departement: departement,
    })
      .populate({
        path: "UserRequest",
        select: "_id nama posisi",
      })
      .populate({
        path: "Departement",
        select: "_id namaDepartement",
      });

    return getCheckoutByDepartementUser;
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

  rejectedApproved: async (req, res) => {
    const { id } = req.params;
    const { StatusWO, UserRequest } = req.body;

    if (!["Belum Approve", "Ditolak"].includes(StatusWO)) {
      throw new BadRequestError(
        "Status work order harus Belum Approve, Ditolak"
      );
    }

    // const getEmailUserRequest = await getEmailRejected({ UserRequest });

    const checkStatus = await Checkout.findOne({ _id: id });

    if (!checkStatus)
      throw new NotFoundError(`Tidak ada WorkOrder dengan id :  ${id}`);

    checkStatus.StatusWO = StatusWO;

    await checkStatus.save();

    // await ApproveRejected(getEmailUserRequest, checkStatus.StatusWO);

    return checkStatus;
  },

  changeStatusWo: async (req, res) => {
    const { id } = req.params;
    const { otp } = req.body;

    // Temukan work order berdasarkan ID
    const workOrder = await Checkout.findById(id);

    // Jika work order tidak ditemukan, lemparkan error
    if (!workOrder) {
      throw new NotFoundError(`Tidak ada WorkOrder dengan id: ${id}`);
    }

    // Jika OTP yang dimasukkan tidak cocok, kembalikan respon dengan pesan kesalahan
    if (workOrder.otp !== otp) {
      throw new BadRequestError("Kode OTP salah");
    }

    // Jika OTP cocok, update status menjadi "Approve"
    const result = await Checkout.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          StatusWO: "Approve",
        },
      },
      { new: true, runValidators: true }
    );

    // Jika tidak ada hasil dari operasi update, lemparkan error
    if (!result) {
      throw new Error("Gagal mengubah status WorkOrder");
    }

    // Jika berhasil, kembalikan respon dengan hasil update
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
