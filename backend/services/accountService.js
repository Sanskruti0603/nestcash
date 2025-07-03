const userModel = require("../module/schema/userModel");
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

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const accountService = {
  AddMoney: async (data, res) => {
    try {
      const { account_no, amount, user_id } = data;

      const transaction = await transactionModel.create({
        user: user_id,
        account: account_no,
        transaction_type: "credit",
        amount: Number(amount),
      });

      if (transaction) {
        const order = await razorpay.orders.create({
          amount: Number(amount) * 100,
          currency: "INR",
          receipt: transaction._id.toString(),
        });

        if (order) {
          return res.status(200).json({
            order_id: order.id,
            txn_id: transaction._id,
            orderAmount: order.amount,
            key_id: process.env.RAZORPAY_KEY_ID,
          });
        } else {
          return res
            .status(500)
            .json({ error: "Failed to create Razorpay order" });
        }
      } else {
        return res.status(500).json({ error: "Transaction creation failed" });
      }
    } catch (err) {
      return res
        .status(500)
        .json({
          error: "Failed to create Razorpay order",
          detail: err.message,
        });
    }
  },
  VerifyPayment: async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        txn_id,
      } = req.body;

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "❌ Signature mismatch" });
      }

      const transaction = await transactionModel.findByIdAndUpdate(
        txn_id,
        {
          isSuccess: true,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          remark: "Money added via Razorpay",
        },
        { new: true }
      );

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      const account = await accountModel.findOne({ _id: transaction.account });

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      const oldAmount = Number(account.amount) || 0;
      const addAmount = Number(transaction.amount) || 0;

      account.amount = oldAmount + addAmount;
      await account.save();

      return res
        .status(200)
        .json({ message: "Payment verified and amount updated" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Verification failed", details: error.message });
    }
  },

  GetAllTransactions: async (req, res) => {
    try {
      const { user_id, account } = req;
      console.log(req);

      const findTransactions = await transactionModel
        .find({
          user: user_id,
          account: account,
        })
        .sort({ createdAt: -1 });
      // .select(
      //   "transaction_type _id user account isSuccess remark createdAt amount"
      // );

      console.log(findTransactions);

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Transactions:",
        findTransactions
      );
    } catch (error) {
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong",
        null
      );
    }
  },

  GetAllAccount: async (req, res) => {
    try {
      const { user_id } = req;

      const findAccounts = await accountModel
        .find({ user: user_id })
        .sort({ createdAt: -1 })
        .populate("user");

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Accounts:",
        findAccounts
      );
    } catch (error) {
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong",
        null
      );
    }
  },
  GetTransactionById: async (req, res) => {
    try {
      const { id } = req;

      const findTransaction = await transactionModel
        .findById(id)
        .populate("user account");

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Transactions:",
        findTransaction
      );
    } catch (error) {
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong",
        null
      );
    }
  },

  AddNewAccount: async (req, res) => {
    try {
      const { account_type, user_id, amount } = req;

      let param = {
        user: user_id,
        account_type: account_type,
        accountNumber: generateAccountNumber(),
        amount: amount || 0,
        isActive: 1,
      };

      const newAccount = await accountModel.create(param);
      console.log(newAccount);
      // const number = "6359482594";
      // await sendSMS(number, `Account is created in nestCash.`);

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Account is created.",
        newAccount
      );
    } catch (error) {
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong",
        null
      );
    }
  },
};

module.exports = accountService;
