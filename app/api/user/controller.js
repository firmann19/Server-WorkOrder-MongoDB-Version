const { StatusCodes } = require("http-status-codes");
const {
  signIn,
  signUp,
  getAllUser,
  getOneUser,
  updateUser,
  deleteUser,
  getAllApprove,
} = require("../../services/mongoose/user");

const register = async (req, res, next) => {
  try {
    const result = await signUp(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await signIn(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

const index = async (req, res, next) => {
  try {
    const result = await getAllUser(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const indexApprove = async (req, res, next) => {
  try {
    const result = await getAllApprove(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const result = await getOneUser(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await updateUser(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await deleteUser(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

module.exports = {
  login,
  register,
  index,
  indexApprove,
  getOne,
  update,
  destroy,
};
