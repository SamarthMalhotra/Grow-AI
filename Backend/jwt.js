import jwt from "jsonwebtoken";
// This functio n will help to generate jwt token
const generateToken = (userData) => {
  return jwt.sign({ userData }, process.env.JWTSECRET, { expiresIn: 55000 });
};
// This function is used to provide protection to routes
const jwtAuthMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(404).json({ message: "you are not Signup" });
  }
  const token = authorization.split(" ")[1].trim();
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  }
  try {
    // verify the JWT Token
    const decode = jwt.verify(token, process.env.JWTSECRET);
    req.user = decode;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
export { generateToken, jwtAuthMiddleware };
