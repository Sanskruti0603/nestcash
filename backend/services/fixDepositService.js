const userModel = require("../module/schema/userModel");
const accountModel = require("../module/schema/accountModel");
const transactionModel = require("../module/schema/transactionModel");
const fixDepositModel = require("../module/schema/fixDeposit");
const atmCardModel = require("../module/schema/atmCardModel");
const Codes = require("../config/statusCodes");
const middleware = require("../middleware/headerValidator");
const bcrypt = require("bcrypt");
const { Account_LIMIT, CARD_TYPE } = require("../utils/constant");
const moment = require("moment");

const fixDepositService = {
  AddFD: async (req, res) => {
    try {
      const { account, amount, apply_for, user_id, duration } = req;
      console.log(req);

      const findAccount = await accountModel.findById(account);
      if (!findAccount) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "Account not found",
          null
        );
      }

      if (findAccount.amount <= Number(amount)) {
        return middleware.sendResponse(
          res,
          Codes.VALIDATION_ERROR,
          "Insufficient account balance.",
          null
        );
      }

      if (findAccount.account_type === "current") {
        if (Number(amount) <= Account_LIMIT.current) {
          return middleware.sendResponse(
            res,
            Codes.VALIDATION_ERROR,
            "Insufficient account balance By Limit.",
            null
          );
        }
      }

      const interest_amount = Number(amount) * (0.1 / 100);

      const maturity_date = moment().add(duration, "months").toDate();

      let param = {
        user: user_id,
        account: account,
        amount: amount,
        duration: duration,
        maturity_date: maturity_date,
        isClaimed: false,
        apply_for: apply_for,
        interest_amount: interest_amount,
        remark: `Fund deposit ${amount}`,
      };

      const newfd = await fixDepositModel.create(param);
      console.log(findAccount);

      const transaction = {
        user: user_id,
        account: account,
        amount: amount,
        isSuccess: true,
        transaction_type: "credit",
        descrition: "fix deposit",
        remark: `Fund deposit ${amount}`,
      };

      await transactionModel.create(transaction);

      let account_update = {
        amount: findAccount.amount - Number(amount),
      };

      await accountModel.findOneAndUpdate(findAccount._id, account_update, {
        new: true,
      });

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Fix deposit is added",
        newfd
      );
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong",
        null
      );
    }
  },

  GetAllFD: async (req, res) => {
    try {
      const { user_id, account } = req;
      const findFDS = await fixDepositModel
        .find({ user: user_id, account: account, isClaimed: false })
        .select(
          "_id amount interest_amount apply_for date isClaimed duration maturity_date"
        );

      if (!findFDS) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "FDS not found",
          null
        );
      }

      return middleware.sendResponse(res, Codes.SUCCESS, "FDS : ", findFDS);
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong",
        null
      );
    }
  },

  // GetFDById: async (req, res) => {
  //   try {
  //     const { id, user_id } = req;

  //     const findFD = await fixDepositModel.findOne({
  //       user: user_id,
  //       _id: id,
  //       isClaimed: false,
  //     });
  //     if (!findFD) {
  //       return middleware.sendResponse(
  //         res,
  //         Codes.NOT_FOUND,
  //         "FD for this user not found.",
  //         null
  //       );
  //     }

  //     const interestPerDay = Number(findFD.amount * (0.1 / 100));

  //     const currentDate = new Date();
  //     const depositDate = new Date(findFD.date);
  //     const totalDays = Math.floor(
  //       (currentDate - depositDate) / (1000 * 60 * 60 * 24)
  //     );

  //     const totalAmount = interestPerDay * totalDays;

  //     let param = {
  //       ...findFD.toObject(),
  //       totalDays: totalDays,
  //       totalAmount: totalAmount,
  //     };

  //     return middleware.sendResponse(res, Codes.SUCCESS, "FD : ", param);
  //   } catch (error) {
  //     console.log(error);
  //     return middleware.sendResponse(
  //       res,
  //       Codes.INTERNAL_ERROR,
  //       "Something is wrong",
  //       null
  //     );
  //   }
  // },

  // ClaimFDById: async (req, res) => {
  //   try {
  //     const { id, user_id } = req;

  //     const findFD = await fixDepositModel.findOne({
  //       user: user_id,
  //       _id: id,
  //       isClaimed: false,
  //     });
  //     if (!findFD) {
  //       return middleware.sendResponse(
  //         res,
  //         Codes.NOT_FOUND,
  //         "FD for this user not found.",
  //         null
  //       );
  //     }

  //     const interestPerDay = Number(findFD.amount * (0.1 / 100));

  //     const currentDate = new Date();
  //     const depositDate = new Date(findFD.date);
  //     const totalDays = Math.floor(
  //       (currentDate - depositDate) / (1000 * 60 * 60 * 24)
  //     );

  //     const totalInterestAmount = interestPerDay * totalDays;

  //     const totalFDAmount = findFD.amount + totalInterestAmount;

  //     let param = {
  //       user: user_id,
  //       account: findFD.account,
  //       amount: parseFloat(totalFDAmount),
  //       isSuccess: true,
  //       transaction_type: "debit",
  //       descrition: "fix deposit claimed",
  //       remark: `Fund claimed - ${totalFDAmount}`,
  //     };

  //     const transaction = await transactionModel.create(param);

  //     const findAccount = await accountModel.findById(findFD.account);
  //     if (!findAccount) {
  //       return middleware.sendResponse(
  //         res,
  //         Codes.NOT_FOUND,
  //         "Accoun not found",
  //         null
  //       );
  //     }

  //     let accountParam = {
  //       amount: findAccount.amount + parseFloat(totalFDAmount),
  //     };

  //     await accountModel.findOneAndUpdate(
  //       { _id: findFD.account },
  //       accountParam,
  //       { new: true }
  //     );

  //     await fixDepositModel.findByIdAndUpdate(
  //       id,
  //       {
  //         isClaimed: true,
  //         claimed_date: Date.now(),
  //       },
  //       { new: true }
  //     );

  //     return middleware.sendResponse(res, Codes.SUCCESS, "FD Claimed", null);
  //   } catch (error) {
  //     console.log(error);
  //     return middleware.sendResponse(
  //       res,
  //       Codes.INTERNAL_ERROR,
  //       "Something is wrong",
  //       null
  //     );
  //   }
  // },

  GetFDById: async (req, res) => {
    try {
      const { id, user_id } = req;

      const findFD = await fixDepositModel
        .findOne({
          user: user_id,
          _id: id,
          isClaimed: false,
        })
        .populate("user");

      if (!findFD) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "FD for this user not found.",
          null
        );
      }

      const currentDate = new Date();
      const maturityDate = new Date(findFD.maturity_date);
      const isMatured = currentDate >= maturityDate;

      const principal = Number(findFD.amount);
      const durationInMonths = findFD.duration; // already saved during creation
      const interestRate = 0.1; // 0.1% per month (example)
      const totalInterest = (principal * interestRate * durationInMonths) / 100;

      const totalAmountAtMaturity = principal + totalInterest;

      const param = {
        ...findFD.toObject(),
        maturityDate: maturityDate,
        isMatured: isMatured,
        interestRate: interestRate,
        durationInMonths: durationInMonths,
        totalInterest: totalInterest.toFixed(2),
        totalAmountAtMaturity: totalAmountAtMaturity.toFixed(2),
      };

      return middleware.sendResponse(res, Codes.SUCCESS, "FD details", param);
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something is wrong",
        null
      );
    }
  },

  ClaimFDById: async (req, res) => {
    try {
      const { id, user_id } = req;

      // 1. Fetch the FD
      const findFD = await fixDepositModel.findOne({
        user: user_id,
        _id: id,
        isClaimed: false,
      });

      if (!findFD) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "FD for this user not found.",
          null
        );
      }

      const currentDate = new Date();
      const maturityDate = new Date(findFD.maturity_date);
      const isEarlyClaim = currentDate < maturityDate;

      const durationInMonths = findFD.duration;
      const interestRate = 0.1; // 10% per month (example)

      // 2. Calculate Interest with or without penalty
      let interest =
        Number(findFD.amount) * (interestRate / 100) * durationInMonths;

      if (isEarlyClaim) {
        // Apply penalty: reduce interest by 50%
        interest *= 0.5;
      }

      const totalFDAmount = Number(findFD.amount) + interest;

      // 3. Create transaction
      const transaction = await transactionModel.create({
        user: user_id,
        account: findFD.account,
        amount: parseFloat(totalFDAmount),
        isSuccess: true,
        transaction_type: "debit",
        descrition: "Fix deposit claimed",
        remark: isEarlyClaim
          ? `Premature FD claimed with penalty - ₹${totalFDAmount.toFixed(2)}`
          : `FD claimed - ₹${totalFDAmount.toFixed(2)}`,
      });

      // 4. Update account balance
      const findAccount = await accountModel.findById(findFD.account);
      if (!findAccount) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "Account not found",
          null
        );
      }

      findAccount.amount += parseFloat(totalFDAmount);
      await findAccount.save();

      // 5. Update FD status
      await fixDepositModel.findByIdAndUpdate(
        id,
        {
          isClaimed: true,
          claimed_date: Date.now(),
          isPremature: isEarlyClaim,
          penalty_applied: isEarlyClaim
            ? "50% interest deduction"
            : "No penalty",
        },
        { new: true }
      );

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        isEarlyClaim
          ? `FD claimed before maturity with penalty. Amount credited: ₹${totalFDAmount.toFixed(
              2
            )}`
          : "FD Claimed successfully",
        null
      );
    } catch (error) {
      console.log(error);
      return middleware.sendResponse(
        res,
        Codes.INTERNAL_ERROR,
        "Something went wrong",
        null
      );
    }
  },
};

module.exports = fixDepositService;
