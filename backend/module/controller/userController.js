const userService = require("../../services/userService");

const registerUser = (req, res) => {
  const request = {
    ...req.body,
  };

  userService.RegisterUser(request, res);
};
const loginUser = (req, res) => {
  const request = {
    ...req.body,
  };

  userService.LoginUser(request, res);
};
const verifyOtp = (req, res) => {
  const request = {
    ...req.body,
    // user_id: req.user.id,
  };
  console.log(req.body);

  userService.VerifyOtp(request, res);
};
const forgotPassword = (req, res) => {
  const request = {
    ...req.body,
    // user_id: req.user.id,
  };
  console.log(req.body);

  userService.ForgotPassword(request, res);
};
const resendOtp = (req, res) => {
  const request = {
    ...req.body,
    // user_id: req.user.id,
  };
  console.log(req.body);

  userService.ResendOtp(request, res);
};
const resetPassword = (req, res) => {
  const request = {
    ...req.body,
    // user_id: req.user.id,
  };
  console.log(req.body);

  userService.ResetPassword(request, res);
};
const profileUser = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  userService.ProfileUser(request, res);
};
const updateUser = (req, res) => {
  const request = {
    ...req.body,
    user_id: req.user.id,
  };

  userService.UpdateUser(request, res);
};

module.exports = {
  registerUser,
  loginUser,
  profileUser,
  updateUser,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword
};
