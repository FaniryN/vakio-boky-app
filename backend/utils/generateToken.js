// import jwt from "jsonwebtoken";

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
// };

// export default generateToken;
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  // CORRECTION : Utiliser le même JWT_SECRET que le middleware
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default generateToken;