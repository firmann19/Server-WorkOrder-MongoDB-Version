const { StatusCodes } = require("http-status-codes");
const {
  createCheckout,
  getAllCheckout,
  getOneCheckout,
  updateCheckout,
  deleteCheckout,
  changeStatusWo,
  changeStatusProgress,
  changeStatusPengerjaan,
  getCheckoutByIdUser,
  getCheckoutByDepartementUser,
  rejectedApproved,
} = require("../../services/mongoose/checkout");

const create = async (req, res, next) => {
  try {
    const result = await createCheckout(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const index = async (req, res, next) => {
  try {
    const result = await getAllCheckout(req);
    console.log("test", result)

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getCheckoutIdUser = async (req, res, next) => {
  try {
    const result = await getCheckoutByIdUser(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCheckoutDepartementUser = async (req, res, next) => {
  try {
    const result = await getCheckoutByDepartementUser(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const result = await getOneCheckout(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await updateCheckout(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await deleteCheckout(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const StatusRejected = async (req, res, next) => {
  try {
    const result = await rejectedApproved(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

const StatusWO = async (req, res, next) => {
  try {
    const result = await changeStatusWo(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const StatusProgress = async (req, res, next) => {
  try {
    const result = await changeStatusProgress(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const StatusPengerjaan = async (req, res, next) => {
  try {
    const result = await changeStatusPengerjaan(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  index,
  getOne,
  update,
  destroy,
  StatusRejected,
  StatusWO,
  StatusProgress,
  StatusPengerjaan,
  getCheckoutIdUser,
  getCheckoutDepartementUser
};
