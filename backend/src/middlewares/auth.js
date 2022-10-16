const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const hashPassword = (req, res, next) => {
  const { password } = req.body;
  argon2
    .hash(password)
    .then((hashedPassword) => {
      req.body.hashPassword = hashedPassword;
      // ou req.hashPassword = hashedPassword;
      delete req.body.password;
      next(); // permet de transférer les éléments du req vers la prochaine fonction dans le router
    })
    .catch((err) => {
      console.warn(`error in HashPassword ${err}`);
    });
};

const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");
    if (authorizationHeader == null) {
      throw new Error("authorizationHeaders missing ");
    }
    const [type, token] = authorizationHeader.split(" "); // ["string1", "string2"]
    // const tokenArray = authorizationHeader.split(" ");
    // tokenArray[0] pour type et tokenArray[1] pour token;
    if (type !== "Bearer") {
      throw new Error("AuthorizationHeader has not the 'Bearer' type");
    }
    req.payload = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.warn(err);
    res.status(401);
  }
};

module.exports = {
  hashPassword,
  verifyToken,
};
