const express = require("express");

const router = express.Router();

const auth = require("./middlewares/auth");
const userControllers = require("./controllers/userControllers");

router.post("/signup", auth.hashPassword, userControllers.signUp);
router.post("/login", userControllers.login, auth.verifyPassword);
router.get("/user", userControllers.getUserByEmail);
router.post("/logout", auth.blackListToken);

// authentification wall
router.use(auth.verifyToken, auth.isTokenBlackListed);
const getMovies = (req, res) => {
  res.json([
    {
      name: "maverick",
    },
  ]);
};

router.get("/movies", getMovies);

module.exports = router;
