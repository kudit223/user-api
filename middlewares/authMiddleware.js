const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized!!",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized!!",
    });
  }
};

module.exports =  authMiddleware;