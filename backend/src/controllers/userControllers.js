const jwt = require("jsonwebtoken");
const { sqlDB } = require("../../db");
/**
 * const Db = require("../../db");
 * goes with return Db.sqlDB
 */

const createUser = ({ name, email, hashPassword }) => {
  const hashedPassword = hashPassword;
  return sqlDB
    .query("INSERT INTO users name, email, hashedPassword VALUES ?, ?, ?", [
      name,
      email,
      hashedPassword,
    ])
    .then(([result]) => {
      if (result.affectedRow === 0) {
        return null;
      }
      return result.insertId;
    })
    .catch((err) => {
      console.warn("error in createUser", err);
    });
};

const getUserByEmail = (email) => {
  let user;
  return sqlDB
    .query("SELECT * FROM users WHERE email=?", [email])
    .then(([users]) => {
      if (users[0] != null) {
        console.warn("@@@@@", users);
        // eslint-disable-next-line prefer-destructuring
        user = users[0];
        return user;
      }
      return null;
    })
    .catch((err) => {
      console.warn("error in getUserByEmail", err);
    });
};

const signUp = (req, res) => {
  const { name, email, hashPassword } = req.body;
  return createUser({ name, email, hashPassword })
    .then((id) => {
      const token = jwt.sign({ sub: id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({
        msg: "User created with success",
        token,
        user: { name, email },
      });
    })
    .catch((err) => {
      console.warn(`err in signup: ${err}`);
      res.sendStatus(500);
    });
};

const login = (req, res, next) => {
  const { email } = req.body;
  return getUserByEmail(email)
    .then((user) => {
      if (!user) {
        res.sendStatus(401);
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.warn("error in login", err);
      res.sendStatus(400);
    });
};

module.exports = {
  signUp,
  getUserByEmail,
  login,
};
