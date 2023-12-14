const { StatusCodes } = require("http-status-codes");
const { createChangeSparepart, getAllChangeSparepart, getOneChangeSparepart, updateChangeSparepart, deleteChangeSparepart, changeStatusPengajuan } = require("../../services/mongoose/changeSparepart");

const create = async (req, res, next) => {
  try {
    const result = await createChangeSparepart(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const index = async (req, res, next) => {
  try {
    const result = await getAllChangeSparepart(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const result = await getOneChangeSparepart(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await updateChangeSparepart(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await deleteChangeSparepart(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    const result = await changeStatusPengajuan(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, index, getOne, update, destroy, changeStatus };
