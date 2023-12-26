const { StatusCodes } = require("http-status-codes");
const {
  CountAllWorkOrder,
  CountAllDepartement,
  CountAllGroup,
  CountAllUser,
  CountOnProgress,
  CountClose,
  ITUserPerformance,
} = require("../../services/mongoose/dashboard");

const AllWorkOrder = async (req, res, next) => {
  try {
    const result = await CountAllWorkOrder(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const AllDepartement = async (req, res, next) => {
  try {
    const result = await CountAllDepartement(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const AllGroup = async (req, res, next) => {
  try {
    const result = await CountAllGroup(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const AllUser = async (req, res, next) => {
  try {
    const result = await CountAllUser(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const AllOnProgress = async (req, res, next) => {
  try {
    const result = await CountOnProgress(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const AllClose = async (req, res, next) => {
  try {
    const result = await CountClose(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  AllWorkOrder,
  AllDepartement,
  AllGroup,
  AllUser,
  AllOnProgress,
  AllClose,
};
