const accountService = require("../../services/accountService");
const addMoney = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  return accountService.AddMoney(request, res);
};
const verifyPayment = (req, res) => {
  const request = {
    ...req,
    user_id: req.user.id,
  };

  return accountService.VerifyPayment(request, res);
};
const getAllTransactions = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  return accountService.GetAllTransactions(request, res);
};
const getTransactionById = (req, res) => {
  const request = {
    ...req.params,
    ...req.body,
    user_id: req.user.id,
  };

  return accountService.GetTransactionById(request, res);
};
const addNewAccount = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  return accountService.AddNewAccount(request, res);
};
const getAllAccount = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  return accountService.GetAllAccount(request, res);
};

module.exports = {
  addMoney,
  verifyPayment,
  getAllTransactions,
  addNewAccount,
  getTransactionById,
  getAllAccount,
};
