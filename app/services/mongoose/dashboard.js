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
        const CountOnProgress = await Checkout.countDocuments({StatusPengerjaan: "OnProgress"});

        return CountOnProgress;
    },
    CountClose: async (req, res) => {
        const CountClose = await Checkout.countDocuments({StatusPengerjaan: "Close"});

        return CountClose;
    },
    ITUserPerformance: async (req, res) => {
      // Mendapatkan informasi user di departemen IT
      const ITUsers = await User.find({ Departement: "IT" });

      // Inisialisasi objek untuk menyimpan hasil perhitungan untuk setiap user
      const userPerformances = [];

      // Loop melalui setiap user di departemen IT
      for (const user of ITUsers) {
        // Menghitung jumlah dokumen Checkout untuk user tertentu
        const totalCheckouts = await Checkout.countDocuments({ User: user._id });

        // Menghitung jumlah dokumen Checkout dengan status "OnProgress" untuk user tertentu
        const countOnProgress = await Checkout.countDocuments({
          User: user._id,
          StatusPengerjaan: "OnProgress",
        });

        // Menghitung jumlah dokumen Checkout dengan status "Close" untuk user tertentu
        const countClose = await Checkout.countDocuments({
          User: user._id,
          StatusPengerjaan: "Close",
        });

        // Menambahkan informasi performa user ke dalam array
        userPerformances.push({
          userId: user._id,
          userName: user.nama,
          totalCheckouts,
          countOnProgress,
          countClose,
        });
      }
    }

}