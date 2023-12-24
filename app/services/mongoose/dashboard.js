const Departement = require("../../api/departement/model");
const Group = require("../../api/group/model");
const User = require("../../api/user/model");
const Checkout = require("../../api/checkoutWO/model");

module.exports = {
  CountAllWorkOrder: async (req, res) => {
    const CountCheckout = await Checkout.countDocuments();

    return CountCheckout;
  },
  CountAllDepartement: async (req, res) => {
    const CountDepartement = await Departement.countDocuments();

    return CountDepartement;
  },
  CountAllGroup: async (req, res) => {
    const CountGroup = await Group.countDocuments();

    return CountGroup;
  },

  CountAllUser: async (req, res) => {
    const CountUser = await User.countDocuments();

    return CountUser;
  },
  CountOnProgress: async (req, res) => {
    const CountOnProgress = await Checkout.countDocuments({
      StatusPengerjaan: "OnProgress",
    });

    return CountOnProgress;
  },
  CountClose: async (req, res) => {
    const CountClose = await Checkout.countDocuments({
      StatusPengerjaan: "Close",
    });

    return CountClose;
  },
  CountPending: async (req, res) => {
    const CountPending = await Checkout.countDocuments({
      StatusPengerjaan: "Pending",
    });

    return CountPending;
  },

  ITUserPerformance: async (req, res) => {
    const userPerformance = await Checkout.aggregate([
      {
        $match: {
          $or: [{ HeadIT: { $exists: true } }, { StaffIT: { $exists: true } }],
        },
      },
      {
        $group: {
          _id: "$StatusPengerjaan",
          count: { $sum: 1 },
        },
      },
    ]);

    // Ambil semua status yang terlibat dalam work order
    const status = userPerformance.map((result) => result._id);

    // Ambil semua nama pengguna (user) berdasarkan status
    const userName = await User.find({ status: { $in: status } });

    // Gabungkan hasil aggregasi kinerja dengan nama pengguna (user)
    const finalResult = userPerformance.map((result) => {
      const user = userName.find((u) => u._status === result._id);
      console.log("result._id:", result._id);
      console.log("user.status:", user ? user.status : "undefined");
      return {
        status: result._id,
        count: result.count,
        userName: user ? user.nama : "Unknown User",
      };
    });

    return finalResult;
  },
};
