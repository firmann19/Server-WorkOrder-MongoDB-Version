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

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
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
  StatusWO,
  StatusProgress,
  StatusPengerjaan,
};
