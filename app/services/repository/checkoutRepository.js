const User = require("../../api/user/model");

module.exports = {
  getEmailApprove: async ({ UserApprove }) => {
    const userRecord = await User.findById(UserApprove);
    return userRecord.email;
  },

  getEmailConfirmation: async ({ HeadIT }) => {
    const HeadITRecord = await User.findById(HeadIT);
    return HeadITRecord.email;
  },
};
