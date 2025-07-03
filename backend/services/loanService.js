const userModel = require("../module/schema/userModel");
const loanModel = require("../module/schema/loanModel");
const accountModel = require("../module/schema/accountModel");
const transactionModel = require("../module/schema/transactionModel");
const fixDepositModel = require("../module/schema/fixDeposit");
const atmCardModel = require("../module/schema/atmCardModel");
const Codes = require("../config/statusCodes");
const middleware = require("../middleware/headerValidator");
const Razorpay = require("razorpay");
const bcrypt = require("bcrypt");
const { Account_LIMIT, CARD_TYPE } = require("../utils/constant");
const { NewRazorpay } = require("../utils/razorpay");
const crypto = require("crypto");
require("dotenv").config();
const { generateAccountNumber } = require("../config/common");
const { sendSMS } = require("../utils/smsService");
require("dotenv").config();

const loanService = {
  ApplyLoan: async (req, res) => {
    try {
      console.log(req);
      const { amount, durationMonths, purpose, user_id, account } = req;

      if (!amount || !durationMonths || !purpose) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "All fields are required.",
          null
        );
      }

      const findUser = await userModel.findById(user_id);
      if (!findUser) {
        return middleware.sendResponse(
          res,
          Codes.INVALID,
          "User not found",
          null
        );
      }

      const interestRate = 10; // Annual Interest Rate (in percent)
      const principal = Number(amount);
      const months = Number(durationMonths);
      const monthlyRate = interestRate / 12 / 100;

      // EMI Formula
      const emiAmount = Math.round(
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1)
      );

      const totalPayble = emiAmount * months;
      const totalInterest = totalPayble - principal;

      const param = {
        user: user_id,
        account,
        amount: principal,
        interestRate,
        durationMonths: months,
        emiAmount,
        purpose,
      };

      const loan = await loanModel.create(param);

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Loan has been applied.",
        {
          ...loan.toObject(),
          totalInterest,
          totalPayble,
        }
      );
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something went wrong!",
        null
      );
    }
  },

  GetLoans: async (req, res) => {
    try {
      const { user_id, account } = req;
      console.log(req);
      const findLoan = await loanModel
        .find({ user: user_id, account: account })
        .populate("account user");

      if (!findLoan || findLoan.length === 0) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "No loans found.",
          []
        );
      }

      return middleware.sendResponse(res, Codes.SUCCESS, "Loans:", findLoan);
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong!",
        null
      );
    }
  },

  GetAllLoans: async (req, res) => {
    try {
      const { user_id } = req;
      console.log(req);
      const findLoan = await loanModel
        .find({ user: user_id })
        .populate("account user");

      if (!findLoan || findLoan.length === 0) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "No loans found.",
          []
        );
      }

      return middleware.sendResponse(res, Codes.SUCCESS, "Loans:", findLoan);
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong!",
        null
      );
    }
  },

  PayEmi: async (req, res) => {
    try {
      const { loanId } = req;
      console.log(req);
      const loan = await loanModel.findById(loanId).populate("user account");

      if (!loan) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "Loan not found",
          null
        );
      }

      if (loan.status !== "approved") {
        return middleware.sendResponse(
          res,
          Codes.INVALID,
          "Loan is not aproved",
          null
        );
      }

      if (loan.paidEMIs >= loan.durationMonths) {
        loan.status = "completed";
        await loan.save();
        return middleware.sendResponse(
          res,
          Codes.SUCCESS,
          "Loan Emi are completed.",
          null
        );
      }

      const findAccount = loan.account;
      if (findAccount.amount < loan.emiAmount) {
        return middleware.sendResponse(
          res,
          Codes.INVALID,
          "Insufficient Balance.",
          null
        );
      }

      findAccount.amount -= loan.emiAmount;
      await findAccount.save();

      const adminBankAccount = process.env.ADMIN_BANK_ACCOUNT_ID;
      const adminAccount = await accountModel.findById(adminBankAccount);
      adminAccount.amount += loan.emiAmount;
      await adminAccount.save();

      await transactionModel.create({
        user: loan.user,
        account: findAccount._id,
        transaction_type: "debit",
        amount: loan.emiAmount,
        remark: "EMI Payment",
        isSuccess: true,
      });

      await transactionModel.create({
        user: null, // or admin ID
        account: adminAccount._id,
        transaction_type: "credit",
        amount: loan.emiAmount,
        remark: `EMI Received from ${loan.user}`,
      });

      loan.paidEMIs += 1;
      if (loan.paidEMIs === loan.durationMonths) {
        loan.status = "completed";
      }
      await loan.save();

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Emi is debited from account.",
        loan
      );
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong!",
        null
      );
    }
  },

  DeleteLoan: async (req, res) => {
    try {
      console.log(req);
      const { loanId } = req;
      const loan = await loanModel.findByIdAndDelete(loanId);

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Loan request is deleted",
        loan
      );
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong!",
        null
      );
    }
  },
};

module.exports = loanService;
