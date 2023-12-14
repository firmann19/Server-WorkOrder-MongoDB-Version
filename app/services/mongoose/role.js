const { NotFoundError, BadRequestError } = require("../../errors");
const Role = require("../../api/role/model");

module.exports = {
  createRole: async (req, res) => {
    const { role } = req.body;

    const check = await Role.findOne({ role });

    //  apa bila check true / data departement sudah ada maka kita tampilkan error bad request dengan message departement duplikat
    if (check) throw new BadRequestError("nama role duplikat");

    const createRole = await Role.create({
      role,
    });
    return createRole;
  },

  getAllRole: async (req, res) => {
    const { keyword } = req.query;

    if (keyword) {
      condition = {
        ...condition,
        role: { $regex: keyword, $options: "i" },
      };
    }

    const result = await Role.find();

    return result;
  },

  getOneRole: async (req, res) => {
    const { id } = req.params;

    const result = await Role.findOne({
      _id: id,
    });

    if (!result) throw new NotFoundError(`Tidak ada role dengan id :  ${id}`);

    return result;
  },

  updateRole: async (req, res) => {
    const { id } = req.params;

    const { role } = req.body;

    const check = await Role.findOne({
      role,
      _id: { $ne: id },
    });

    if (check) throw new BadRequestError("nama role duplikat");

    const result = await Role.findOneAndUpdate(
      { _id: id },
      { role },
      { new: true, runValidators: true }
    );

    // jika id result false / null maka akan menampilkan error 'Tidak ada error dengan id'
    if (!result) throw new NotFoundError(`Tidak ada role dengan id : ${id}`);

    return result;
  },

  deleteRole: async (req, res) => {
    const { id } = req.params;

    const result = await Role.findOne({
      _id: id,
    });

    if (!result) throw new NotFoundError(`Tidak ada role dengan id :  ${id}`);

    await result.remove();

    return result;
  },
};
