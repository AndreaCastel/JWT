const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { sqlDB } = require("../../db");

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

const createWebToken = (userId) => {
  const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

const verifyPassword = (req, res) => {
  const { password } = req.body;
  const { hashedPassword, id: userId } = req.user;
  argon2.verify(hashedPassword, password).then((isVerified) => {
    if (!isVerified) {
      res.sendStatus(401);
    }
    const token = createWebToken(userId);
    delete req.user.hashedPassword;
    res.send({ token, user: req.user });
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

const blackListToken = (req, res, next) => {
  const authorizationHeader = req.get("Authorization");
  if (authorizationHeader == null) {
    throw new Error("Authorization header is missing");
  }
  // 'Bearer ${token}` ; ["Bearer", "lkqfjmq"]
  const [, token] = authorizationHeader.split(" ");
  sqlDB
    .query("INSERT INTO token_blacklist token VALUES ?", [token])
    .then(([insertedToken]) => {
      console.warn("TOKEN ID", insertedToken.insertId);
      res.send({ msg: "USER LOGGED OUT" });
    })
    .catch((err) => {
      console.warn("error in blacklisttoken", err);
      res.sendStatus(401);
    });
  next();
};

const isTokenBlackListed = (req, res, next) => {
  const authorizationHeader = req.get("Authorization");
  if (authorizationHeader == null) {
    throw new Error("Authorization header is missing");
  }
  const [, token] = authorizationHeader.split(" ");
  sqlDB
    .query("SELECT * FROM token_blacklist WHERE token=?", [token])
    .then(([tokens]) => {
      if (tokens[0] != null) {
        res.send({ msg: "TOKEN EXPIRED" });
      }
      next();
    });
};

module.exports = {
  hashPassword,
  createWebToken,
  verifyPassword,
  verifyToken,
  blackListToken,
  isTokenBlackListed,
};
