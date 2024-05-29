const User = require("../../api/user/model");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../../errors");
const { createJWT, createTokenUser, createRefreshJWT } = require("../../utils");
const {
  CountAllWorkOrder,
  CountAllUser,
  CountAllGroup,
  CountOnProgress,
  CountClose,
  CountPending,
  CountAllDepartement,
} = require("./dashboard");
const { checkingImage } = require("./images");
const { createUserRefreshToken } = require("./refreshToken");

module.exports = {
  signUp: async (req, res) => {
    const { image, nama, email, posisi, role, password, departement, group } =
      req.body;

    await checkingImage(image);

    const createdUser = await User.create({
      image,
      nama,
      email,
      posisi,
      role,
      password,
      departement,
      group,
    });

    return createdUser;
  },

  signIn: async (req) => {
    const { email, password } = req.body;

    //Cek kondisi password dan email
    if (!email || !password) {
      throw new BadRequestError("Please provide email and password");
    }

    const result = await User.findOne({ email: email })
      .populate({
        path: "departement",
        select: "namaDepartement",
      })
      .populate({
        path: "role",
        select: "role",
      })
      .populate({
        path: "image",
        select: "_id name",
      });

    const getDataWO = await CountAllWorkOrder();
    const getDataUser = await CountAllUser();
    const getDataDepartement = await CountAllDepartement();
    const getDataGroup = await CountAllGroup();
    const getOnProgress = await CountOnProgress();
    const getClose = await CountClose();
    const getPending = await CountPending();

    if (!result) {
      throw new UnauthorizedError("Invalid Credentials");
    }

    const checkAllUser = await User.find();

    const isPasswordCorrect = await result.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedError("Invalid Credentials");
    }

    const token = createJWT({ payload: createTokenUser(result) });

    const refreshToken = createRefreshJWT({ payload: createTokenUser(result) });
    await createUserRefreshToken({
      refreshToken,
      user: result._id,
    });

    return {
      token,
      refreshToken,
      user: result.nama,
      namaDepartement: result.departement.namaDepartement,
      departementId: result.departement._id,
      userId: result._id,
      role: result.role.role,
      getNameManager: (checkAllUser.nama = "Arif Wibowo"),
      getManager: (checkAllUser._id = "65852c81f813056993c1815a"),
      getAllWO: getDataWO,
      getAllUser: getDataUser,
      getAllDepartement: getDataDepartement,
      getAllGroup: getDataGroup,
      getAllOnProgress: getOnProgress,
      getAllClose: getClose,
      getAllPending: getPending,
      image: result.image.name,
    };
  },

  getAllApprove: async (req, res) => {
    const { departement } = req.user;

    const getAllApproveUsers = await User.find({ departement: departement });

    return getAllApproveUsers;
  },

  getAllUser: async (req, res) => {
    const { keyword, departement, group } = req.query;

    let condition = {};

    if (keyword) {
      condition = { ...condition, nama: { $regex: keyword, $options: "i" } };
    }

    if (departement) {
      condition = { ...condition, departement: departement };
    }

    if (group) {
      condition = { ...condition, group: group };
    }

    const result = await User.find(condition)
      .populate({
        path: "image",
        select: "_id name",
      })
      .populate({
        path: "role",
        select: "_id role",
      })
      .populate({
        path: "posisi",
        select: "_id jabatan",
      })
      .populate({
        path: "departement",
        select: "_id namaDepartement",
      })
      .populate({
        path: "group",
        select: "_id namaGroup",
      });

    return result;
  },

  getOneUser: async (req, res) => {
    const { id } = req.params;

    const result = await User.findOne({
      _id: id,
    })
      .populate({
        path: "image",
        select: "_id name",
      })
      .populate({
        path: "role",
        select: "_id role",
      })
      .populate({
        path: "posisi",
        select: "_id jabatan",
      })
      .populate({
        path: "departement",
        select: "_id namaDepartement",
      })
      .populate({
        path: "group",
        select: "_id namaGroup",
      });

    if (!result) throw new NotFoundError(`Tidak ada User dengan id :  ${id}`);

    return result;
  },

  updateUser: async (req, res) => {
    const { id } = req.params;

    const { image, nama, email, posisi, role, password, departement, group } =
      req.body;

    const result = await User.findOneAndUpdate(
      { _id: id },
      {
        image,
        nama,
        email,
        posisi,
        role,
        password,
        departement,
        group,
      },
      { new: true, runValidators: true }
    );

    if (!result) throw new NotFoundError(`Tidak ada User dengan id :  ${id}`);

    return result;
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;

    const result = await User.findOne({
      _id: id,
    });

    if (!result) throw new NotFoundError(`Tidak ada user dengan id :  ${id}`);

    await result.remove();

    return result;
  },
};
