const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (data, expiresIn = "7d") => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn });
};

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(500).send({
        error: "token not found",
      });
    }
    const token = authHeader.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log("invalid token", error);
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
