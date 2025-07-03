const loanService = require("../../services/loanService");

const applyLoan = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  return loanService.ApplyLoan(request, res);
};
const getLoans = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  return loanService.GetLoans(request, res);
};
const getAllLoans = (req, res) => {
  console.log(req);
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  return loanService.GetAllLoans(request, res);
};
const payEmi = (req, res) => {
  const request = {
    ...req.params,
    ...req.body,
    user_id: req.user.id,
  };

  return loanService.PayEmi(request, res);
};
const deleteLoan = (req, res) => {
  const request = {
    ...req.params,
    ...req.body,
    user_id: req.user.id,
  };
  console.log("request", request);

  return loanService.DeleteLoan(request, res);
};

module.exports = {
  applyLoan,
  getLoans,
  payEmi,
  deleteLoan,
  getAllLoans,
};
