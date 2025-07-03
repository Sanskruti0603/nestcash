const adminService = require("../../services/adminService");
const getUsers = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  return adminService.GetUsers(request, res);
};
const freezeAccount = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  return adminService.FreezeAccount(request, res);
};
const getTransactions = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  return adminService.GetTransactions(request, res);
};
const getStat = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  return adminService.GetStat(request, res);
};
const login = (req, res) => {
  const request = {
    ...req.body,
  };

  return adminService.Login(request, res);
};
const getUserById = (req, res) => {
  const request = {
    ...req.params,
    ...req.body,
    user_id: req.user.id,
  };

  return adminService.GetUserById(request, res);
};
const unfreezeAccount = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  return adminService.UnfreezeAccount(request, res);
};
const updateLoanStatus = (req, res) => {
  // const request = {
  //   req,
  //   user_id: req.user.id,
  // };

  return adminService.updateLoanStatus(req, res);
};
const getAllLoansOfUsers = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  return adminService.GetAllLoansOfUsers(request, res);
};

module.exports = {
  getUsers,
  freezeAccount,
  getTransactions,
  getStat,
  login,
  getUserById,
  unfreezeAccount,
  updateLoanStatus,
  getAllLoansOfUsers,
};
