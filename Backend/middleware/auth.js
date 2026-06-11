// middleware/auth.js

const { verifyToken } = require("@clerk/backend");

module.exports = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.replace(
        "Bearer ",
        ""
      );

    if (!token)
      return res.status(401).json({
        message: "No token",
      });

    const payload = await verifyToken(
      token,
      {
        secretKey:
          process.env.CLERK_SECRET_KEY,
      }
    );

    req.auth = payload;

    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};