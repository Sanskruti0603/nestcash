const userModel = require("../module/schema/userModel");
const accountModel = require("../module/schema/accountModel");
const transactionModel = require("../module/schema/transactionModel");
const atmCardModel = require("../module/schema/atmCardModel");
const fixDepositModel = require("../module/schema/fixDeposit");
const Codes = require("../config/statusCodes");
const middleware = require("../middleware/headerValidator");
const bcrypt = require("bcrypt");
const { Account_LIMIT, CARD_TYPE } = require("../utils/constant");
const { generateToken } = require("../utils/JwtService");
const loanModel = require("../module/schema/loanModel");
const sendMail = require("../utils/sendMail");

const adminService = {
  Login: async (req, res) => {
    try {
      const { email, password } = req;
      if (!email || !password) {
        return middleware.sendResponse(
          res,
          Codes.BAD_REQUEST,
          "Email and password are required."
        );
      }

      const user = await userModel.findOne({ email });

      if (!user) {
        return middleware.sendResponse(
          res,
          Codes.UNAUTHORIZED,
          "Admin not found with this email."
        );
      }

      if (user.role !== "admin") {
        return middleware.sendResponse(
          res,
          Codes.UNAUTHORIZED,
          "Access denied. You are not an admin."
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return middleware.sendResponse(
          res,
          Codes.UNAUTHORIZED,
          "Invalid password."
        );
      }

      const token = generateToken({
        id: user._id,
        role: user.role,
        email: user.email,
      });

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Admin login successful",
        {
          token,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      );
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong.",
        null
      );
    }
  },

  GetUsers: async (req, res) => {
    try {
      const { user_id } = req;
      const findUser = await userModel.findById(user_id);
      if (findUser.role === "user") {
        return middleware.sendResponse(
          res,
          Codes.UNAUTHORIZED,
          "Access Denied.",
          null
        );
      }

      const findUsers = await userModel.find({});
      const loans = await loanModel.find({}).populate("user");

      // ✅ Group loan statuses
      const loanStatusCounts = {
        approved: 0,
        pending: 0,
        rejected: 0,
      };

      for (const loan of loans) {
        if (loan.status === "approved") loanStatusCounts.approved++;
        else if (loan.status === "pending") loanStatusCounts.pending++;
        else if (loan.status === "rejected") loanStatusCounts.rejected++;
      }

      const param = {
        users: findUsers,
        loans,
        loanStatusCounts,
      };

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Here are Users:",
        param
      );
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong.",
        null
      );
    }
  },
  UnfreezeAccount: async (req, res) => {
    try {
      const { user_id, account } = req;
      const findUser = await userModel.findById(user_id);
      if (findUser.role !== "admin") {
        return middleware.sendResponse(
          res,
          Codes.UNAUTHORIZED,
          "Access Denied.",
          null
        );
      }

      const findAccount = await accountModel.findById(account);
      if (!findAccount) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "Account Not found",
          null
        );
      }

      const update = await accountModel.findByIdAndUpdate(
        account,
        { isFrozen: false },
        { new: true }
      );

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Account has been unfrozen",
        update
      );
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something went wrong.",
        null
      );
    }
  },

  GetUserById: async (req, res) => {
    try {
      const { user_id, id } = req;
      const findUser = await userModel.findById(user_id);
      if (findUser.role === "user") {
        return middleware.sendResponse(
          res,
          Codes.UNAUTHORIZED,
          "Access Denied.",
          null
        );
      }

      const user = await userModel.findById(id);
      const findAccount = await accountModel.find({ user: id });

      let param = {
        user: user.toObject(), // Convert Mongoose document to plain JS object
        accounts: findAccount, // Attach array as a field
      };

      if (user) {
        return middleware.sendResponse(
          res,
          Codes.SUCCESS,
          "Here is Users:",
          param
        );
      }
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong.",
        null
      );
    }
  },

  FreezeAccount: async (req, res) => {
    try {
      const { user_id, account } = req;
      const findUser = await userModel.findById(user_id);
      if (findUser.role === "user") {
        return middleware.sendResponse(
          res,
          Codes.UNAUTHORIZED,
          "Access Denied.",
          null
        );
      }

      const findAccount = await accountModel.findById(account);
      if (!findAccount) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "ACcount Not found",
          null
        );
      }

      let param = {
        isFrozen: true,
      };

      const update = await accountModel.findByIdAndUpdate(account, param, {
        new: true,
      });
      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Account has been frozen",
        update
      );
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong.",
        null
      );
    }
  },
  GetTransactions: async (req, res) => {
    try {
      const { user_id } = req;
      const findUser = await userModel.findById(user_id);
      if (findUser.role === "user") {
        return middleware.sendResponse(
          res,
          Codes.UNAUTHORIZED,
          "Access Denied.",
          null
        );
      }

      const findTransactions = await transactionModel.find({}).populate({
        path: "account",
        populate: { path: "user", select: "email" },
      });
      if (!findTransactions) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "transaction Not found",
          null
        );
      }
      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Transactions:",
        findTransactions
      );
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong.",
        null
      );
    }
  },
  GetStat: async (req, res) => {
    try {
      const { user_id } = req;
      const findUser = await userModel.findById(user_id);
      if (findUser.role === "user") {
        return middleware.sendResponse(
          res,
          Codes.UNAUTHORIZED,
          "Access Denied.",
          null
        );
      }

      const users = await userModel.countDocuments();
      const accounts = await accountModel.countDocuments();
      const transactions = await transactionModel.countDocuments();

      const totalBalanceAgg = await accountModel.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      const totalBalance = totalBalanceAgg[0]?.total || 0;
      const activeFds = await fixDepositModel.countDocuments({
        isClaimed: false,
      });
      const atmCards = await atmCardModel.countDocuments();

      let param = {
        users,
        accounts,
        totalBalance,
        transactions,
        activeFds,
        atmCards,
      };

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Here is details:",
        param
      );
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong.",
        null
      );
    }
  },

  updateLoanStatus: async (req, res) => {
    try {
      const { loanId } = req.params;
      const { status } = req.body;
      const user_id = req.user.id;

      console.log(loanId, status);

      const findUser = await userModel.findById(user_id);
      if (findUser.role === "user") {
        return middleware.sendResponse(
          res,
          Codes.UNAUTHORIZED,
          "Access Denied.",
          null
        );
      }

      if (!["approved", "rejected"].includes(status)) {
        return middleware.sendResponse(
          res,
          Codes.INVALID,
          "Invalid status",
          null
        );
      }

      const loanStatus = await loanModel
        .findByIdAndUpdate(loanId, { status }, { new: true })
        .populate("user");

      if (status === "approved" && loanStatus?.account) {
        const findAccount = await accountModel.findById(loanStatus.account);
        findAccount.amount += loanStatus.amount;
        await findAccount.save();

        await transactionModel.create({
          user: loanStatus.user,
          account: findAccount._id,
          transaction_type: "credit",
          amount: loanStatus.amount,
          remark: "Loan credited",
          isSuccess: true,
        });
      }

      if (loanStatus?.user?.email) {
        let subject = "";
        let html = "";

        if (status === "approved") {
          subject = "🎉 Your Loan Request Has Been Approved!";
          html = `
          <h2>Hello ${loanStatus.user.name},</h2>
          <p>We're happy to inform you that your loan request of ₹${loanStatus.amount} has been <strong style="color:green;">approved</strong>.</p>
          <p>The amount will be reflected in your NestCash account shortly.</p>
          <p>Thank you for banking with us.</p>
        `;
        } else if (status === "rejected") {
          subject = " Your Loan Request Has Been Rejected";
          html = `
          <h2>Hello ${loanStatus.user.name},</h2>
          <p>We regret to inform you that your loan request of ₹${loanStatus.amount} has been <strong style="color:red;">rejected</strong>.</p>
          <p>Please contact our support team for more details.</p>
        `;
        }

        await sendMail(loanStatus.user.email, subject, html);
      }

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Bank Loan Status Updated.",
        loanStatus
      );
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong.",
        null
      );
    }
  },

  GetAllLoansOfUsers: async (req, res) => {
    try {
      const { user_id } = req;
      const findUser = await userModel.findById(user_id);
      if (findUser.role === "user") {
        return middleware.sendResponse(
          res,
          Codes.UNAUTHORIZED,
          "Access Denied.",
          null
        );
      }

      const loans = await loanModel
        .find({ status: "pending" })
        .populate("user account");

      const approvedLoan = await loanModel
        .find({ status: "approved" })
        .populate("user account");
      const rejectedLoan = await loanModel
        .find({ status: "rejected" })
        .populate("user account");

      const param = {
        loans: loans,
        approvedLoan: approvedLoan,
        rejectedLoan: rejectedLoan,
      };
      return middleware.sendResponse(res, Codes.SUCCESS, "Loans:", param);
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong.",
        null
      );
    }
  },
};

module.exports = adminService;
