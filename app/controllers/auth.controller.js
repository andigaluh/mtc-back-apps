const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Job = db.job;
const Org = db.org;
const user_roles = db.user_roles;
const Job_class = db.job_class;
const Org_class = db.org_class;
const RefreshToken = db.refreshToken;
const fs = require("fs");

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const mailsender = require("../middleware/mailsender");
const encDec = require("../middleware/encDec")
const configMail = require("../config/mail.config");
const { org, job, job_class } = require("../models");

exports.signup = (req, res) => {

    if (!req.body.username) {
        res.status(400).send({
        message: "Username can not be empty!"
        });
        return
    }

    if (!req.body.email) {
        res.status(400).send({
        message: "Email can not be empty!"
        });
        return;
    }

    if (!req.body.password) {
        res.status(400).send({
        message: "Password can not be empty!",
        });
        return;
    }

  // Save User to Database
  User.create({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    picture: req.body.picture,
    password: bcrypt.hashSync(req.body.password, 8),
    status: req.body.status,
    job_id: req.body.job_id
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: configMail.userRegistrationSuccessText });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: configMail.userRegistrationSuccessText });
        });
      }

      let encryptedId = encDec.encryptedString(user.id);
      let urlActivation = config.URL + "/api/auth/activate/" + encryptedId;

      let textMsg = configMail.userRegistrationText.replace("{req.body.name}", req.body.name).replace("{req.body.email}", req.body.email).replace("{req.body.password}", req.body.password).replace("{urlActivation}", urlActivation);
      
      let htmlMsg = configMail.userRegistrationHTML.replace("{req.body.name}", req.body.name).replace("{req.body.email}", req.body.email).replace("{req.body.password}", req.body.password).replace("{urlActivation}", urlActivation).replace("{urlActivationText}", urlActivation);

      mailsender({
        to: req.body.email,
        subject: configMail.userRegistrationSubject,
        text: textMsg,
        html: htmlMsg,
      });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
    include: [
      {
        model: Job,
        as: "job",
        attributes: ["id", "name", "job_class_id", "org_id"],
        include: [
          {
            model: Job_class,
            as: "job_class",
            attributes: ["id", "name", "upper_job_class_id"],
          },
          {
            model: Org,
            as: "org",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
  })
    .then(async (user) => {
      //console.log(JSON.stringify(user, null, 2));
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      if (user.status === false) {
        return res.status(404).send({ message: "User not active" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration, // 24 hours
      });

      let refreshToken = await RefreshToken.createToken(user);

      var authorities = [];
      var upper_job_class_id = user.job.job_class.upper_job_class_id;
      var user_org_id = user.job.org.id;
      var superior_id = [];

      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        User.update(
          { accesstoken: token, last_signin: Date() },
          { where: { id: user.id } }
        ).then((num) => {
          console.log("update accessToken : " + num);
        });

        Job.findAll({
          where: {
            job_class_id: {
              [Op.eq]: upper_job_class_id,
            },
            org_id: {
              [Op.eq]: user_org_id,
            },
          },
        }).then((superior_job) => {
          let superior_jobArr = [];

          superior_job.map((val) => {
            superior_jobArr.push(val.id);
          });

          User.findAll({
            where: {
              job_id: {
                [Op.in]: superior_jobArr,
              },
              status: {
                [Op.eq]: true,
              },
            },
          }).then((superior_user) => {
            superior_user.map((value) => {
              superior_id.push({
                id: value.id,
                username: value.username,
                name: value.name,
                email: value.email,
              });
            });

            const data_resp = {
              id: user.id,
              username: user.username,
              phone: user.phone,
              name: user.name,
              email: user.email,
              roles: authorities,
              accessToken: token,
              refreshToken: refreshToken,
              last_signin: Date(),
              job_id: user.job_id,
              job: user.job,
              superior_id: superior_id,
              picture: user.picture
            };
            res.status(200).send(data_resp);
          });
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signinBarcode = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      if (user.status === false) {
        return res.status(404).send({ message: "User not active" });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        User.update(
          { accesstoken: token, last_signin: Date() },
          { where: { id: user.id } }
        ).then((num) => {
          console.log("update accessToken : " + num);
        });

        res.status(200).send({
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          roles: authorities,
          accessToken: token,
          last_signin: Date(),
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.logout = (req, res) => {
  const id = req.userId
  const logoutToken = ""
  User.update({
    accesstoken: logoutToken
  }, {
    where: { id: id },
  })
    .then((num) => { 
      if (num == 1) {
        res.send({
          message: "User was Logout.",
        });
      } else {
        res.send({
          message: `Cannot logout User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error logout User with id=" + id,
      });
    });
};

// Activate / non-activate user by id
exports.activate = (req, res) => {
  //const id = req.params.id;
  const id = req.params.id;
  const status = (req.params.status == "true") ? true : false;

  User.update({
    status: status
  }, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        if (status == true) {
          res.send({
            message: "User is active",
          });
        } else {
          res.send({
            message: "User is not-active",
          });
        }
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Activate / non-activate user by email
exports.activateByEmail = (req, res) => {
  const id = encDec.decryptedString(req.params.id);
  const status = true;

  User.update({
    status: status
  }, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        if (status == true) {
          res.send({
            message: "Congratulation User is active now",
          });
        } else {
          res.send({
            message: "User is not-active",
          });
        }
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.params is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error updating User with id=" + id,
      });
    });
};

exports.findMe = async (req, res) => {
  const id = req.userId;

  User.findByPk(id, {
    attributes: ["id", "username", "email", "status", "createdAt", "updatedAt", "last_signin"]
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update and save an user by login
exports.updateMe = (req, res) => {
  //const id = req.params.id;
  const id = req.userId;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Update and save an user by login
exports.updatePasswordByMe = (req, res) => {
  const id = req.params.id;
  //const id = req.userId;

  User.update(
    { password: bcrypt.hashSync(req.body.password, 8) },
    {
      where: { id: id },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Updated password success",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Delete user by id
exports.delete = (req, res) => {
  const id = req.params.id;
  //const id = req.userId;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// check valid email
exports.findByEmail = (req, res) => {
  const email = req.body.email;
  User.findOne({
    where: { email },
    order: [['id', 'DESC']],
    attributes: ["id", "name", "email"],
  })
    .then((data) => {
      if (data) {
        res.send({ status: true, message: "verification link has been send to your email", content: data });
        let encryptedId = encDec.encryptedString(data.email);
        let urlActivation = config.CORSURL + "/reset-password/" + encryptedId;

        let textMsg = configMail.userForgetPasswordText.replace("{req.body.name}", data.name).replace("{urlActivation}", urlActivation);

        let htmlMsg = configMail.userForgetPasswordHTML.replace("{req.body.name}", data.name).replace("{urlActivation}", urlActivation).replace("{urlActivationText}", urlActivation);

        mailsender({
          to: req.body.email,
          subject: configMail.userForgetPasswordSubject,
          text: textMsg,
          html: htmlMsg,
        });

      } else {
        res.send({ status: false, message: "email not found", content: "" });
      }

    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving agendas.",
      });
    });
};

// check valid email from encrypted id
exports.findEmailEnc = (req, res) => {
  const email = encDec.decryptedString(req.params.id);

  User.findOne({
    where: { email },
    order: [["id", "DESC"]],
    attributes: ["id", "name", "email"],
  })
    .then((data) => {
      if (data) {
        res.send({ status: true, message: "valid email", content: data });
      } else {
        res.send({ status: false, message: "email not found", content: "" });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving agendas.",
      });
    });
};

// reset password
exports.resetPassword = (req, res) => {
  const email = req.body.email;

  User.update(
    { password: bcrypt.hashSync(req.body.password, 8) },
    {
      where: { email },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: `Password was updated successfully. You can login / sign in now`,
        });
      } else {
        res.send({
          message: `Cannot update User with email=${email}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error updating User with email=" + email,
      });
    });
};

// Retrieve all Job_class from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  
  User.findAll({
    where: condition,
    include: [
      {
        model: Job,
        as: "job",
        include: [
          {
            model: Org,
            as: "org"
          }
        ]
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving org_class.",
      });
    });
};

// Delete user by id
exports.delete = (req, res) => {
  const id = req.params.id;
  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// Read user by id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  User.findByPk(id, {
    include: [
      {
        model: Job,
        as: "job"
      }
    ]
  })
    .then((data) => {
      var authorities = [];
      data.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name);
        }

        res.status(200).send({
          id: data.id,
          name: data.name,
          username: data.username,
          phone: data.phone,
          email: data.email,
          status: data.status,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          job_id: data.job_id,
          job: {
            id: data.job.id,
            name: data.job.name,
          },
          roles: authorities,
        });
      });
      //res.send(data);
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update and save an user
exports.update = (req, res) => {
  const id = req.params.id;

  let data = {};

  if (req.file) {
    data = {
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      picture: req.file.filename,
      job_id: req.body.job_id
    };

    User.findByPk(id, {
      attributes: ["picture"],
    })
      .then((responseFile) => {
        if (responseFile) {
          fs.unlink(
            __basedir +
              "/resources/static/assets/uploads/" +
              responseFile.picture,
            () => {}
          );
          console.log(
            `proses delExistingFile dari update user ${responseFile.picture}`
          );
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            "Error deleting picture with id=" +
            id +
            "with error : " +
            err,
        });
      });
  } else {
    data = {
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      job_id: req.body.job_id,
    };
  }

  User.update(data, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        User.findByPk(id).then((user) => {
          if (req.body.roles) {
            Role.findAll({
              where: {
                name: {
                  [Op.or]: req.body.roles,
                },
              },
            }).then((roles) => {
              user.setRoles(roles).then(() => {
                res.send({
                  message:
                    "Update user success."
                });
              });
            });
          }
        })
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error updating User with id=" + id,
      });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({
      where: { token: requestToken },
    });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      }); 
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    //let refreshToken = await RefreshToken.createToken(user);

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};