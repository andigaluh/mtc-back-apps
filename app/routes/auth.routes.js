const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");
const uploadFile = require("../middleware/uploadFile");

module.exports = function(app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
      /* authJwt.verifyToken, */
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signinBarcode", controller.signinBarcode);

  app.post("/api/auth/logout", [authJwt.verifyToken], controller.logout);

  app.get("/api/auth/activate/:id", controller.activateByEmail);

  // Retrieve a single User with id
  app.get("/api/auth/me", [authJwt.verifyToken], controller.findMe);

  // Update a User with id
  app.put("/api/auth/me", [authJwt.verifyToken], controller.updateMe);

  // Update a Password User with id
  app.put(
    "/api/auth/change-password/:id",
    [authJwt.verifyToken],
    controller.updatePasswordByMe
  );

  // Delete a User with id
  app.delete("/api/auth/me", [authJwt.verifyToken], controller.delete);

  // check valid email
  app.post("/api/auth/check-valid-email", controller.findByEmail);

  // check valid email from encryption id
  app.get("/api/auth/check-valid-email-enc/:id", controller.findEmailEnc);

  //update reset-password by email
  app.put("/api/auth/reset-password", controller.resetPassword);

  // Retrieve all users
  app.get("/api/auth/all", [authJwt.verifyToken], controller.findAll);

  // Delete a User with id
  app.delete("/api/auth/remove/:id", [authJwt.verifyToken], controller.delete);

  // Retrieve a single User with id
  app.get(
    "/api/auth/detail/:id",
    [authJwt.verifyToken],
    controller.findOne
  );

  // Update a User with id
  app.put(
    "/api/auth/update/:id",
    [authJwt.verifyToken, uploadFile.single("file")],
    controller.update
  );

  app.post("/api/auth/refreshtoken", controller.refreshToken);
  
};

