const userModel = require("../module/schema/userModel");
const accountModel = require("../module/schema/accountModel");
const transactionModel = require("../module/schema/transactionModel");
const fixDepositModel = require("../module/schema/fixDeposit");
const atmCardModel = require("../module/schema/atmCardModel");
const Codes = require("../config/statusCodes");
const middleware = require("../middleware/headerValidator");
const bcrypt = require("bcrypt");
const { generateAccountNumber } = require("../config/common");
const { generateToken } = require("../utils/JwtService");
const sendMail = require("../utils/sendMail");

const userService = {
  generateOtp: () => {
    return Math.floor(1000 + Math.random() * 9000);
  },
  RegisterUser: async (req, res) => {
    try {
      const { name, email, password, phone, account_type } = req;

      const findEmail = await userModel.findOne({ email: email });
      if (findEmail) {
        return middleware.sendResponse(
          res,
          Codes.ALREADY_EXISTS,
          "Email is already exists",
          null
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let param = {
        name: name,
        email: email,
        password: password ? hashedPassword : password,
        phone: phone,
        account_type: account_type,
      };

      const newUser = await userModel.create(param);

      const htmlContent = `
      <h2>Welcome to NestCash, ${name}!</h2>
      <p>Your account has been successfully created.</p>
      <p>We're excited to have you onboard.</p>
    `;
      const mail = await sendMail(email, "Welcome to NestCash 🎉", htmlContent);

      console.log("mail sent:", mail);

      let newAc = {
        user: newUser._id,
        amount: 0,
        account_type: newUser.account_type,
        accountNumber: generateAccountNumber(),
      };

      const newAccount = await accountModel.create(newAc);

      let new_transaction = {
        user: newUser._id,
        account: newAccount._id,
        amount: 0,
        isSuccess: true,
        transaction_type: "credit",
        remark: "Account Opening!",
      };

      const newTransaction = await transactionModel.create(new_transaction);

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        `Hey ${newUser.name},You have been registerd!`,
        newUser
      );
    } catch (error) {
      console.error("Registration error:", error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong!",
        null
      );
    }
  },

  LoginUser: async (req, res) => {
    try {
      const { email, password } = req;

      const findUser = await userModel.findOne({ email: email });
      if (!findUser) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "Email Not Exist!",
          null
        );
      }

      const isPasswordMatch = await bcrypt.compare(password, findUser.password);
      if (!isPasswordMatch) {
        return middleware.sendResponse(
          res,
          Codes.INVALID,
          "Entered Password is not valid.",
          null
        );
      }

      if (findUser.otp === null) {
        await userModel.findOneAndUpdate(
          { email: email },
          { isVerified: false },
          { new: true }
        );
      }

      const loginOtp = userService.generateOtp();
      console.log(loginOtp);

      const token = generateToken({ id: findUser._id, email: findUser.email });

      let param = {
        token: token,
        status: "active",
        role: "user",
        otp: loginOtp,
      };

      const updateUser = await userModel.findOneAndUpdate({ email }, param, {
        new: true,
      });

      const htmlContent = `
      <h2>Welcome to NestCash, ${findUser.name}!</h2>
      <p>Your account has been successfully created.</p>
      <p>Your Login OTP is ${loginOtp}.</p>
      <p>Verify it Now!.</p>
    `;
      await sendMail(email, "Welcome to NestCash 🎉", htmlContent);

      return middleware.sendResponse(res, Codes.SUCCESS, "OTP sent!", {
        token,
        user_id: updateUser._id,
        isVerified: updateUser.isVerified,
        role: updateUser.role,
      });
    } catch (error) {
      console.error("Registration error:", error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong!",
        null
      );
    }
  },

  VerifyOtp: async (req, res) => {
    try {
      const { otp, user_id } = req;
      console.log(req);

      const user = await userModel.findById(user_id);
      if (!user) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "User not found",
          null
        );
      }

      if (user.otp !== otp) {
        return middleware.sendResponse(
          res,
          Codes.INVALID,
          "OTP is invalid",
          null
        );
      }
      if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
        return middleware.sendResponse(
          res,
          Codes.INVALID,
          "OTP has expired",
          null
        );
      }

      await userModel.findByIdAndUpdate(user_id, {
        isVerified: true,
        otp: null,
        otpExpiresAt: null,
      });

      return middleware.sendResponse(res, Codes.SUCCESS, "OTP verified!", {
        token: user.token,
        role: user.role,
      });
    } catch (error) {
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something went wrong",
        null
      );
    }
  },

  ResendOtp: async (req, res) => {
    try {
      const { user_id } = req;

      const user = await userModel.findById(user_id);
      if (!user) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "User not found",
          null
        );
      }

      const newOtp = userService.generateOtp();

      const htmlContent = `
      <h2>Hello again, ${user.name}!</h2>
      <p>Your new login OTP is <strong>${newOtp}</strong>.</p>
      <p>This OTP is valid for 5 minutes.</p>
    `;

      await sendMail(user.email, "New OTP for NestCash Login 🔐", htmlContent);

      user.otp = newOtp;
      user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
      await user.save();

      return middleware.sendResponse(res, Codes.SUCCESS, "New OTP sent!", null);
    } catch (error) {
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something went wrong",
        null
      );
    }
  },

  ForgotPassword: async (req, res) => {
    try {
      const { email } = req;

      const user = await userModel.findOne({ email });
      if (!user) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "Email not registered",
          null
        );
      }

      const otp = userService.generateOtp();

      const htmlContent = `
      <h2>Password Reset Request</h2>
      <p>Hello ${user.name},</p>
      <p>Your OTP for resetting your NestCash password is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 5 minutes.</p>
    `;

      await sendMail(
        user.email,
        "Reset Your Password - NestCash 🔐",
        htmlContent
      );

      user.otp = otp;
      user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
      await user.save();

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "OTP sent to your email",
        {
          user_id: user._id,
        }
      );
    } catch (error) {
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something went wrong while sending OTP",
        null
      );
    }
  },

  ResetPassword: async (req, res) => {
    try {
      const { user_id, newPassword } = req;

      if (!newPassword || newPassword.length < 6) {
        return middleware.sendResponse(
          res,
          Codes.INVALID,
          "Password must be at least 6 characters",
          null
        );
      }

      const user = await userModel.findById(user_id);
      if (!user) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "User not found",
          null
        );
      }

    
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      user.otp = null;
      user.otpExpiresAt = null;
      await user.save();

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Password reset successful!",
        null
      );
    } catch (error) {
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something went wrong while resetting password",
        null
      );
    }
  },

  ProfileUser: async (req, res) => {
    try {
      const { user_id } = req;

      if (!user_id) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "User Id is not valid",
          null
        );
      }

      const findUser = await userModel
        .findById(user_id)
        .select("name email phone createdAt account_type -_id");
      if (!findUser) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "User Not Found",
          null
        );
      }

      const profile = {};

      const findAccount = await accountModel
        .findOne({ user: user_id })
        .select("_id amount");
      if (!findAccount) {
        let param = {
          user: user_id,
          amount: 0,
          account_type: findUser.account_type,
          accountNumber: generateAccountNumber(),
        };

        await accountModel.create(param);
      }

      const findTrasaction = await transactionModel.findOne({
        user: user_id,
        remark: "Account Opening!",
      });
      if (!findTrasaction) {
        let param = {
          user: user_id,
          account: findAccount._id,
          amount: 0,
          isSuccess: true,
          transaction_type: "credit",
          remark: "Account Opening!",
        };
        await transactionModel.create(param);
      }

      profile["account"] = findAccount;
      profile["fd_amount"] = 0;

      const findFD = await fixDepositModel.find({
        user: user_id,
        isClaimed: false,
      });

      let totalDeposit;

      if (findFD.length > 0) {
        totalDeposit = findFD
          .map((fd) => fd.amount)
          .reduce((sum, value) => sum + value, 0);
        profile["fd_amount"] = totalDeposit;
      } else {
        profile["fd_amount"] = 0;
      }

      const findAtms = await atmCardModel
        .find({ user: user_id })
        .select("_id card_type");

      return middleware.sendResponse(res, Codes.SUCCESS, "user profile:", {
        ...findUser.toObject(),
        profile,
        findAtms,
      });
    } catch (error) {
      console.error("Registration error:", error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong!",
        null
      );
    }
  },

  UpdateUser: async (req, res) => {
    try {
      const { name, email, phone, user_id } = req;

      const findUser = await userModel.findById(user_id);
      if (!findUser) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "User not found",
          null
        );
      }

      const param = {
        name: name,
        email: email,
        phone: phone,
      };

      const updateUser = await userModel.findByIdAndUpdate(user_id, param, {
        new: true,
      });
      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "User is Updated",
        updateUser
      );
    } catch (error) {
      console.error("Registration error:", error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong!",
        null
      );
    }
  },
};

module.exports = userService;
