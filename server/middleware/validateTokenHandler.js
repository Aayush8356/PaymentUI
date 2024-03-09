const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let accessToken;
  const authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    accessToken = authHeader.split(" ")[1];
  }
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(401);
      return Error("User is not valid or access token expired");
    }
    req.user = decoded.user;
    next();
  });
  if (!accessToken) {
    res.status(401);
    return Error("Token is not valid or invalid user");
  }
});
module.exports = validateToken;
