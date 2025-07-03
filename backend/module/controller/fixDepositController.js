const fixDepositService = require("../../services/fixDepositService");

const addFD = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  return fixDepositService.AddFD(request, res);
};
const getAllFD = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  return fixDepositService.GetAllFD(request, res);
};

const getFDById = (req, res) => {
  const request = {
    ...req.params,
    ...req.body,
    user_id: req.user.id,
  };

  return fixDepositService.GetFDById(request, res);
};
const claimFDById = (req, res) => {
  const request = {
    ...req.params,
    ...req.body,
    user_id: req.user.id,
  };

  return fixDepositService.ClaimFDById(request, res);
};

module.exports = {
  addFD,
  getAllFD,
  getFDById,
  claimFDById
};
