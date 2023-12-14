const { StatusCodes } = require("http-status-codes");
const {
  createPosisi,
  getAllPosisi,
  getOnePosisi,
  updatePosisi,
  deletePosisi,
} = require("../../services/mongoose/posisi");

const create = async (req, res, next) => {
  try {
    const result = await createPosisi(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const index = async (req, res, next) => {
  try {
    const result = await getAllPosisi(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const result = await getOnePosisi(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await updatePosisi(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await deletePosisi(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, index, getOne, update, destroy };
