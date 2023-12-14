const { StatusCodes } = require("http-status-codes");
const {
  createDepartement,
  getAllDepartement,
  getOneDepartement,
  updateDepartement,
  deleteDepartement,
} = require("../../services/mongoose/departement");

const create = async (req, res, next) => {
  try {
    const result = await createDepartement(req);

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
    const result = await getAllDepartement(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const result = await getOneDepartement(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await updateDepartement(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await deleteDepartement(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, index, getOne, update, destroy };
