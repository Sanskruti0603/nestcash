const Account_LIMIT = {
  saving: 0,
  current: 10,
};

const CARD_TYPE = {
  basic: {
    max: 1000,
    min: 0,
  },
  classic: {
    max: 5000,
    min: 0,
  },
  platinum: {
    max: 10000,
    min: 0,
  },
};

module.exports = {
  Account_LIMIT,
  CARD_TYPE,
};
