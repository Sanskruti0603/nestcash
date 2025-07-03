const atmService = require("../../services/atmService");
const addAtm = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  return atmService.AddAtm(request, res);
};
const getAtmById = (req, res) => {
  const request = {
    ...req.params,
    ...req.body,
    user_id: req.user.id,
  };

  return atmService.GetAtmById(request, res);
};
const getAllAtms = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  return atmService.GetAllAtms(request, res);
};
const withdrwalAtmById = (req, res) => {
  const request = {
    ...req.params,
    ...req.body,
    user_id: req.user.id,
  };

  return atmService.WithdrwalAtmById(request, res);
};

module.exports = {
  addAtm,
  getAllAtms,
  getAtmById,
  withdrwalAtmById
};
