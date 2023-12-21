const User = require("../../api/user/model");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../../errors");
const { createJWT, createTokenUser } = require("../../utils");
const {
  CountAllWorkOrder,
  CountAllUser,
  CountAllGroup,
  CountOnProgress,
  CountClose,
  CountPending,
} = require("./dashboard");
const { checkingImage } = require("./images");

module.exports = {
  signUp: async (req, res) => {
    const { image, nama, email, posisi, role, password, departement, group } =
      req.body;

    //Cek kondisi
    if (!nama) {
      throw new BadRequestError("Nama belum di input");
    } else if (!email) {
      throw new BadRequestError("Email belum di input");
    } else if (!posisi) {
      throw new BadRequestError("Posisi belum di input");
    } else if (!role) {
      throw new BadRequestError("Role belum di input");
    } else if (!password) {
      throw new BadRequestError("Password belum di input");
    } else if (!group) {
      throw new BadRequestError("Group belum di input");
    } else if (!departement) {
      throw new BadRequestError("Departement belum di input");
    }

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
    const getDataDepartement = await CountAllGroup();
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

    return {
      token,
      user: result.nama,
      namaDepartement: result.departement.namaDepartement,
      departementId: result.departement._id,
      userId: result._id,
      role: result.role.role,
      getNameManager: (checkAllUser.nama = "Arif Wibowo"),
      getManager: (checkAllUser._id = "6580fffcd505f153dc1796d6"),
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
    //console.log('Departement', departement)

    const getAllApproveUsers = await User.find({ departement: departement });
    //console.log("Result", getAllApproveUsers)

    return getAllApproveUsers;
  },

  getAllUser: async (req, res) => {
    const result = await User.find()
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
