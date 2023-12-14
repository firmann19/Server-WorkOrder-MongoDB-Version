const { NotFoundError, BadRequestError } = require("../../errors");
const Group = require("../../api/group/model");

module.exports = {
  createGroup: async (req, res) => {
    const { namaGroup } = req.body;

    const check = await Group.findOne({ namaGroup });

    //  apa bila check true / data departement sudah ada maka kita tampilkan error bad request dengan message departement duplikat
    if (check) throw new BadRequestError("nama group duplikat");

    const createGroup = await Group.create({
      namaGroup,
    });
    return createGroup;
  },

  getAllGroup: async (req, res) => {
    const { keyword } = req.query;

    if (keyword) {
      condition = {
        ...condition,
        namaGroup: { $regex: keyword, $options: "i" },
      };
    }

    const result = await Group.find();

    return result;
  },

  getOneGroup: async (req, res) => {
    const { id } = req.params;

    const result = await Group.findOne({
      _id: id,
    });

    if (!result) throw new NotFoundError(`Tidak ada group dengan id :  ${id}`);

    return result;
  },

  updateGroup: async (req, res) => {
    const { id } = req.params;

    const { namaGroup } = req.body;

    const check = await Group.findOne({
      namaGroup,
      _id: { $ne: id },
    });

    if (check) throw new BadRequestError("nama group duplikat");

    const result = await Group.findOneAndUpdate(
      { _id: id },
      { namaGroup },
      { new: true, runValidators: true }
    );

    // jika id result false / null maka akan menampilkan error 'Tidak ada error dengan id'
    if (!result) throw new NotFoundError(`Tidak ada group dengan id : ${id}`);

    return result;
  },

  deleteGroup: async (req, res) => {
    const { id } = req.params;

    const result = await Group.findOne({
      _id: id,
    });

    if (!result) throw new NotFoundError(`Tidak ada group dengan id :  ${id}`);

    await result.remove();

    return result;
  },
};
