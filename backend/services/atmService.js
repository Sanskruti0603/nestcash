const userModel = require("../module/schema/userModel");
const accountModel = require("../module/schema/accountModel");
const transactionModel = require("../module/schema/transactionModel");
const atmCardModel = require("../module/schema/atmCardModel");
const Codes = require("../config/statusCodes");
const middleware = require("../middleware/headerValidator");
const bcrypt = require("bcrypt");
const { Account_LIMIT, CARD_TYPE } = require("../utils/constant");

const atmService = {
  generateCardNo: () => {
    let digits = "";
    for (let i = 0; i < 16; i++) {
      digits += Math.floor(Math.random() * 10);
    }
    return digits.match(/.{1,4}/g).join(" "); // e.g., "1234 5678 9012 3456"
  },

  generateCVV: () => {
    return Math.floor(100 + Math.random() * 900);
  },

  AddAtm: async (req, res) => {
    try {
      const { account, pin, card_type, user_id } = req;

      const findATM = await atmCardModel.findOne({
        account: account,
        card_type: card_type,
      });

      if (findATM) {
        return middleware.sendResponse(
          res,
          Codes.ALREADY_EXISTS,
          "Atm Card is laready exists.",
          findATM
        );
      }

      let card_no = atmService.generateCardNo();
      let cvv = atmService.generateCVV();

      const date = new Date();
      const newDate = new Date(date);
      newDate.setFullYear(newDate.getUTCFullYear() + 3);

      const expiry = newDate.toLocaleDateString("en-CA");

      const hashPin = await bcrypt.hash(pin, 10);

      let param = {
        user: user_id,
        account: account,
        card_no: card_no,
        cvv: cvv,
        date: date.toISOString().split("T")[0],
        expiry: expiry,
        pin: pin ? hashPin : pin,
        card_type: card_type,
      };

      const newAtm = await atmCardModel.create(param);

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Atm Card is Created",
        newAtm
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

  GetAtmById: async (req, res) => {
    try {
      const { id, user_id } = req;

      const findAtm = await atmCardModel
        .findById(id)
        .select("-pin -user -account")
        .populate("user account");

      if (!findAtm) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "Atm Card Not Found.",
          null
        );
      } else {
        return middleware.sendResponse(
          res,
          Codes.SUCCESS,
          "Atm Card:",
          findAtm
        );
      }
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

  GetAllAtms: async (req, res) => {
    try {
      const { user_id, account } = req;

      const findAtm = await atmCardModel.find({
        user: user_id,
        account: account,
      });

      if (!findAtm) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "Atm Card Not Found.",
          null
        );
      } else {
        return middleware.sendResponse(
          res,
          Codes.SUCCESS,
          "Atm Card:",
          findAtm
        );
      }
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

  WithdrwalAtmById: async (req, res) => {
    try {
      const { amount, id, user_id, pin } = req;
      const amount_requested = Number(amount);

      const findUser = await userModel.findById(user_id);
      if (!findUser) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "User is not found.",
          null
        );
      }

      const findATM = await atmCardModel.findById(id);
      if (!findATM) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "Atm Card is not found.",
          null
        );
      }

      const findAccount = await accountModel.findById(findATM.account);
      if (!findAccount) {
        return middleware.sendResponse(
          res,
          Codes.NOT_FOUND,
          "Account Not Found.",
          null
        );
      }

      const isPinMatched = await bcrypt.compare(pin, findATM.pin);
      if (!isPinMatched) {
        let param = {
          user: user_id,
          account: findAccount._id,
          transaction_type: "debit",
          amount: amount_requested,
          isSuccess: false,
          remark: "enter valid pin",
        };
        await transactionModel.create(param);
        return middleware.sendResponse(
          res,
          Codes.INVALID,
          "Pin is invalid",
          null
        );
      }

      if (findAccount.account_type === "current") {
        if (findAccount.amount <= Account_LIMIT.current) {
          let param = {
            user: user_id,
            account: findAccount._id,
            transaction_type: "debit",
            amount: amount_requested,
            isSuccess: false,
            remark: "Insufficient Minimum Balance By Limit.",
          };

          await transactionModel.create(param);
          return middleware.sendResponse(
            res,
            Codes.INVALID,
            "Insufficient Minimum Balance By Limit.",
            null
          );
        }
      }

      if (amount_requested >= findAccount.amount) {
        let param = {
          user: user_id,
          account: findAccount._id,
          transaction_type: "debit",
          amount: amount_requested,
          isSuccess: false,
          remark: "Balance is Not available.",
        };

        await transactionModel.create(param);
        return middleware.sendResponse(
          res,
          Codes.INVALID,
          "Balance is Not available.",
          null
        );
      }

      switch (findATM.card_type) {
        case "basic":
          if (amount_requested < CARD_TYPE.basic.min) {
            return middleware.sendResponse(
              res,
              Codes.VALIDATION_ERROR,
              "Minimum Amount",
              null
            );
          }
          if (amount_requested > CARD_TYPE.basic.max) {
            return middleware.sendResponse(
              res,
              Codes.VALIDATION_ERROR,
              "Maximum Amount",
              null
            );
          }
        case "classic":
          if (amount_requested < CARD_TYPE.classic.min) {
            return middleware.sendResponse(
              res,
              Codes.VALIDATION_ERROR,
              "Minimum Amount",
              null
            );
          }
          if (amount_requested > CARD_TYPE.classic.max) {
            return middleware.sendResponse(
              res,
              Codes.VALIDATION_ERROR,
              "Maximum Amount",
              null
            );
          }
        case "paltinum":
          if (amount_requested < CARD_TYPE.platinum.min) {
            return middleware.sendResponse(
              res,
              Codes.VALIDATION_ERROR,
              "Minimum Amount",
              null
            );
          }
          if (amount_requested > CARD_TYPE.platinum.max) {
            return middleware.sendResponse(
              res,
              Codes.VALIDATION_ERROR,
              "Maximum Amount",
              null
            );
          }

        // default:
        //     return middleware.sendResponse(res,Codes.INVALID,"card type is invalid",null)
      }

      let param = {
        amount: findAccount.amount - amount_requested,
      };

      const withdrawAmt = await accountModel.findByIdAndUpdate(
        findAccount._id,
        param,
        { new: true }
      );

      await transactionModel.create({
        user: user_id,
        account: findAccount._id,
        transaction_type: "debit",
        amount: amount_requested,
        isSuccess: true,
        remark: "Money withdraw from ATM",
      });

      return middleware.sendResponse(
        res,
        Codes.SUCCESS,
        "Money has been withdraw!",
        withdrawAmt
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
};

module.exports = atmService;
