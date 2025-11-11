const jwt = require("jsonwebtoken");
const VeriftJWt = (req, res, next) => {
  const authHeaders = req.headers.authorization || req.headers.Authorization;
  if (!authHeaders) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeaders.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    jwt.verify(token, process.env.JWt, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.userInfo = {};
      req.userInfo.id = decoded.id;
      req.userInfo.userName = decoded.userName;
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};