const createTokenUser = (user) => {
  return {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    posisi: user.posisi,
    departement: user.departement,
    group: user.group,
  };
};

module.exports = { createTokenUser };
