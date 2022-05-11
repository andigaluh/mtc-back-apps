const db = require("../models");
const Notif = db.notif;
const Op = db.Sequelize.Op;

// Retrieve all Machine from the database.
exports.findAll = (req, res) => {
  const user_id = req.query.user_id;
  var condition = user_id ? { user_id: { [Op.eq]: `${user_id}` } } : null;

  Notif.findAll({ where: condition, order: [ ['id','DESC']] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notif.",
      });
    });
};

exports.findUnread = (req, res) => {
  const user_id = req.query.user_id;
  //var condition = user_id ? { user_id: { [Op.eq]: `${user_id}` } } : null;

  Notif.findAll({ where: {
      user_id : {
          [Op.eq] : user_id
      },
      is_read : {
          [Op.eq] : 0
      }
  } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notif.",
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Notif.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Delete notification success.",
        });
      } else {
        res.send({
          message: `Cannot delete notification with id=${id}. Maybe notification was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete notification with id=" + id,
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Notif.findByPk(id)
    .then((data) => {
      if (data) {
        
        Notif.update({is_read : true}, {
          where: { id: id },
        }).then((num) => {
            if (num == 1) {
              res.send(data);
            } else {
              res.send({
                message: `Cannot update Notif with id=${id}. Maybe Notif was not found or req.body is empty!`,
              });
            }
          }).catch((err) => {
            res.status(500).send({
              message: "Error updating Notif with id=" + id,
            });
          });
        
        //res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Notif with id=${id}.`,
        });
      }
    }).catch((err) => {
      res.status(500).send({
        message: "Error retrieving Notif with id=" + id,
      });
    });
};
