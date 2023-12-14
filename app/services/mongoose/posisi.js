const { NotFoundError, BadRequestError } = require("../../errors");
const Posisi = require("../../api/posisi/model");

module.exports = {
  createPosisi: async (req, res) => {
    const { jabatan } = req.body;

    const check = await Posisi.findOne({ jabatan });

    //  apa bila check true / data departement sudah ada maka kita tampilkan error bad request dengan message departement duplikat
    if (check) throw new BadRequestError("nama posisi duplikat");

    const createPosisi = await Posisi.create({
      jabatan,
    });
    return createPosisi;
  },

  getAllPosisi: async (req, res) => {
    const { keyword } = req.query;

    if (keyword) {
      condition = {
        ...condition,
        jabatan: { $regex: keyword, $options: "i" },
      };
    }

    const result = await Posisi.find();

    return result;
  },

  getOnePosisi: async (req, res) => {
    const { id } = req.params;

    const result = await Posisi.findOne({
      _id: id,
    });

    if (!result) throw new NotFoundError(`Tidak ada posisi dengan id :  ${id}`);

    return result;
  },

  updatePosisi: async (req, res) => {
    const { id } = req.params;

    const { jabatan } = req.body;

    const check = await Posisi.findOne({
      jabatan,
      _id: { $ne: id },
    });

    if (check) throw new BadRequestError("nama posisi duplikat");

    const result = await Posisi.findOneAndUpdate(
      { _id: id },
      { jabatan },
      { new: true, runValidators: true }
    );

    // jika id result false / null maka akan menampilkan error 'Tidak ada error dengan id'
    if (!result) throw new NotFoundError(`Tidak ada posisi dengan id : ${id}`);

    return result;
  },

  deletePosisi: async (req, res) => {
    const { id } = req.params;

    const result = await Posisi.findOne({
      _id: id,
    });

    if (!result) throw new NotFoundError(`Tidak ada posisi dengan id :  ${id}`);

    await result.remove();

    return result;
  },
};
