import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id, isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default generateToken;