const { NotFoundError, BadRequestError } = require("../../errors");
const Departement = require("../../api/departement/model");

module.exports = {
  createDepartement: async (req, res) => {
    const { namaDepartement } = req.body;

    const check = await Departement.findOne({ namaDepartement });

    //  apa bila check true / data departement sudah ada maka kita tampilkan error bad request dengan message departement duplikat
    if (check) throw new BadRequestError("nama departement duplikat");

    const createDepartement = await Departement.create({
      namaDepartement,
    });
    return createDepartement;
  },

  getAllDepartement: async (req, res) => {
   const { keyword } = req.query;

    let condition = {};

    if (keyword) {
      condition = {
        ...condition,
        namaDepartement: { $regex: keyword, $options: "i" },
      };
    }

    const result = await Departement.find(condition);

    return result;
  },

  getOneDepartement: async (req, res) => {
    const { id } = req.params;

    const result = await Departement.findOne({
      _id: id,
    });

    if (!result)
      throw new NotFoundError(`Tidak ada departement dengan id :  ${id}`);

    return result;
  },

  updateDepartement: async (req, res) => {
    const { id } = req.params;

    const { namaDepartement } = req.body;

    const check = await Departement.findOne({
      namaDepartement,
      _id: { $ne: id },
    });

    if (check) throw new BadRequestError("nama departement duplikat");

    const result = await Departement.findOneAndUpdate(
      { _id: id },
      { namaDepartement },
      { new: true, runValidators: true }
    );

    // jika id result false / null maka akan menampilkan error 'Tidak ada error dengan id'
    if (!result)
      throw new NotFoundError(`Tidak ada departement dengan id : ${id}`);

    return result;
  },

  deleteDepartement: async (req, res) => {
    const { id } = req.params;

    const result = await Departement.findOne({
      _id: id,
    });

    if (!result)
      throw new NotFoundError(`Tidak ada departement dengan id :  ${id}`);

    await result.remove();

    return result;
  },
};
