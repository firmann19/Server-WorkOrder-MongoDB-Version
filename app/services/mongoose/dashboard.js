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
};
