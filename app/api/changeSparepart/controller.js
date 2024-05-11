const { StatusCodes } = require("http-status-codes");
const {
  createChangeSparepart,
  getAllChangeSparepart,
  getOneChangeSparepart,
  deleteChangeSparepart,
  RejectStatusPengajuan,
  ApproveStatusPengajuan,
} = require("../../services/mongoose/changeSparepart");

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

const ApproveStatus = async (req, res, next) => {
  try {
    const result = await ApproveStatusPengajuan(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
    console.log(error)
  }
};

const RejectStatus = async (req, res, next) => {
  try {
    const result = await RejectStatusPengajuan(req);

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
  destroy,
  ApproveStatus,
  RejectStatus,
};
