const Checkout = require("../../api/checkoutWO/model");
const User = require("../../api/user/model");
const { NotFoundError, BadRequestError } = require("../../errors");
const {
  verifMail,
  DiketahuiWO,
  ApproveRejected,
  ApproveAccepted,
  StatusOnProgress,
  StatusClose,
} = require("../mail");
const {
  getEmailApprove,
  getEmailConfirmation,
} = require("../repository/checkoutRepository");
// const io = require("socket.io")();

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
      });

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
          duration: {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          },
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
    const { StatusWO } = req.body;

    if (!["Belum Approve", "Ditolak"].includes(StatusWO)) {
      throw new BadRequestError(
        "Status work order harus Belum Approve, Ditolak"
      );
    }

    const checkStatus = await Checkout.findOne({ _id: id }).populate(
      "UserRequest"
    );

    if (!checkStatus)
      throw new NotFoundError(`Tidak ada WorkOrder dengan id :  ${id}`);

    //Dapatkan ID pengguna dari properti UserRequest
    const userId = checkStatus.UserRequest;

    //Temukan pengguna yang sesuai berdasarkan ID pengguna
    const user = await User.findById(userId);

    if (!user)
      throw new NotFoundError(`Tidak ada pengguna dengan id :  ${userId}`);

    //Dapatkan email pengguna dari model User
    const userEmail = user.email;

    //Update StatusWO pada dokumen Checkout
    checkStatus.StatusWO = StatusWO;

    const namaBarang = checkStatus.NamaBarang;
    const kodeBarang = checkStatus.KodeBarang;

    await checkStatus.save();

    //Kirim email ke pengguna jika StatusWO adalah "Ditolak"
    if (StatusWO === "Ditolak") {
      await ApproveRejected(userEmail, {
        NamaBarang: namaBarang,
        KodeBarang: kodeBarang,
      });
    }

    // // Kirim notifikasi ke klien yang terhubung melalui WebSocket
    // io.emit("notification", {
    //   message: `Work order ${checkStatus._id} telah diupdate menjadi ${StatusWO}`,
    //   status: StatusWO,
    // });

    return checkStatus;
  },

  changeStatusWo: async (req, res) => {
    const { id } = req.params;
    const { otp } = req.body;

    // Temukan work order berdasarkan ID
    const workOrder = await Checkout.findById(id).populate("UserRequest");

    // Jika work order tidak ditemukan, lemparkan error
    if (!workOrder) {
      throw new NotFoundError(`Tidak ada WorkOrder dengan id: ${id}`);
    }

    //Dapatkan ID pengguna dari properti UserRequest
    const userId = workOrder.UserRequest;

    //Temukan pengguna yang sesuai berdasarkan ID pengguna
    const user = await User.findById(userId);

    if (!user)
      throw new NotFoundError(`Tidak ada pengguna dengan id :  ${userId}`);

    //Dapatkan email pengguna dari model User
    const userEmail = user.email;

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

    const namaBarang = result.NamaBarang;
    const kodeBarang = result.KodeBarang;

    //Kirim email ke pengguna jika StatusWO adalah "Ditolak"
    if (result.StatusWO === "Approve") {
      await ApproveAccepted(userEmail, {
        NamaBarang: namaBarang,
        KodeBarang: kodeBarang,
      });
    }

    // Jika berhasil, kembalikan respon dengan hasil update
    return result;
  },

  changeStatusPengerjaan: async (req, res) => {
    const { id } = req.params;
    const { StatusPengerjaan } = req.body;

    if (!["Pending", "On Progress"].includes(StatusPengerjaan)) {
      throw new BadRequestError("Status pengerjaan harus Pending, on Progress");
    }

    const checkStatusPengerjaan = await Checkout.findOne({ _id: id }).populate(
      "UserRequest"
    );

    if (!checkStatusPengerjaan)
      throw new NotFoundError(`Tidak ada WorkOrder dengan id :  ${id}`);

    //Dapatkan ID pengguna dari properti UserRequest
    const userId = checkStatusPengerjaan.UserRequest;

    //Temukan pengguna yang sesuai berdasarkan ID pengguna
    const user = await User.findById(userId);

    if (!user)
      throw new NotFoundError(`Tidak ada pengguna dengan id :  ${userId}`);

    //Dapatkan email pengguna dari model User
    const userEmail = user.email;

    checkStatusPengerjaan.StatusPengerjaan = StatusPengerjaan;

    const namaBarang = checkStatusPengerjaan.NamaBarang;
    const kodeBarang = checkStatusPengerjaan.KodeBarang;

    await checkStatusPengerjaan.save();

    //Kirim email ke pengguna jika StatusWO adalah "Ditolak"
    if (StatusPengerjaan === "On Progress") {
      await StatusOnProgress(userEmail, {
        NamaBarang: namaBarang,
        KodeBarang: kodeBarang,
      });
    }

    return checkStatusPengerjaan;
  },

  changeStatusProgress: async (req, res) => {
    const { id } = req.params;

    // Temukan work order berdasarkan ID
    const workOrder = await Checkout.findById(id).populate("UserRequest");

    // Jika work order tidak ditemukan, lemparkan error
    if (!workOrder) {
      throw new NotFoundError(`Tidak ada WorkOrder dengan id: ${id}`);
    }

    //Dapatkan ID pengguna dari properti UserRequest
    const userId = workOrder.UserRequest;

    //Temukan pengguna yang sesuai berdasarkan ID pengguna
    const user = await User.findById(userId);

    if (!user)
      throw new NotFoundError(`Tidak ada pengguna dengan id :  ${userId}`);

    //Dapatkan email pengguna dari model User
    const userEmail = user.email;

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

    const namaBarang = result.NamaBarang;
    const kodeBarang = result.KodeBarang;

    //Kirim email ke pengguna jika StatusWO adalah "Ditolak"
    if (result.StatusWO === "Approve") {
      await StatusClose(userEmail, {
        NamaBarang: namaBarang,
        KodeBarang: kodeBarang,
      });
    }

    return result;
  },
};
