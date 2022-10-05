const db = require("../models");
const Machine = db.machine;
const Machine_check = db.machine_check;
const Parts = db.parts;
const Machine_parts = db.machine_parts;
const Op = db.Sequelize.Op;

// Create and Save a new Machine
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  if (!req.body.code) {
    res.status(400).send({
      message: "code can not be empty!",
    });
    return;
  }

  // Create a Machine
  const machine = {
    name: req.body.name,
    code: req.body.code,
    description: req.body.description,
    location: req.body.location,
    status: req.body.status ? req.body.status : false,
  };

  // Save Machine in the database
  Machine.create(machine)
    .then((data) => {
      //res.send(data);
      res.send({
        message: "Create machine success.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Machine.",
      });
    });
};

// Retrieve all Machine from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Machine.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving machine.",
      });
    });
};

// Find a single Machine with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Machine.findByPk(id)
    .then((data) => {
      if (data) {
        var spareparts = [];
        
        data.getParts().then((parts) => {
          for (let i = 0; i < parts.length; i++) {
            spareparts.push(
              {
                "id" : parts[i].id,
                "name" : parts[i].name,
                "standard" : parts[i].standard,
                "method" : parts[i].method,
                "description" : parts[i].description,
              }
            );
          }
          var machineParts = [];
          Machine_parts.findAll({
            where: {
              machine_id: {
                [Op.eq]: data.id,
              },
            },
            attributes: [
              "id",
              "machine_id",
              "parts_id"
            ],
          }).then( async (machine_parts) => {
            //console.log(JSON.stringify(machine_parts,null,2));
            for (let i = 0; i < machine_parts.length; i++) {
              machineParts.push({
                id: machine_parts[i].id,
                machine_id: machine_parts[i].machine_id,
                parts_id: machine_parts[i].parts_id,
              });
            }


            const maxIdMachineCheck = await Machine_check.max('id');
            //console.log(machineParts);

            const dataResponse = {
              id: data.id,
              code: data.code,
              name: data.name,
              description: data.description,
              location: data.location,
              status: data.status,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              parts: spareparts,
              machineParts: machineParts,
              maxIdMachineCheck: maxIdMachineCheck,
            };

            //console.log(dataResponse);

            res.status(200).send(dataResponse);
          });
        });
        //res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Machine with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Machine with id=" + id,
      });
    });
};

// Update a Machine by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Machine.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Update machine success.",
        });
      } else {
        res.send({
          message: `Cannot update Machine with id=${id}. Maybe Machine was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Machine with id=" + id,
      });
    });
};


exports.updateParts = (req, res) => {
  const id = req.params.id;

  Machine.findByPk(id).then((machine) => {
    const parts_id = req.body.parts_id;
    //console.log(`jumlah parts_id = ${parts_id.length}`)
    if (parts_id.length > 0) {
      Parts.findAll({
        where: {
          name: {
            [Op.or]: req.body.parts_id,
          },
        },
      }).then((parts) => {
        machine.setParts(parts).then(() => {
          res.send({
            message: "Create machine-parts success",
          });
        });
      });
    } else {

    Machine_parts.destroy({
      where: { machine_id: id },
    }).then((numParts) => {
      res.send({
        message: "Create machine-parts success",
      });
    }).catch((error) => {
      res.status(500).send({
        message: "Could not delete Machine parts with machine_id=" + id,
      });
    });

    }

  });
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  const selectMachineParts = await Machine_parts.findAll({where : { machine_id : id}});
  if (selectMachineParts.length > 0) {
    const delMachineParts = await Machine_parts.destroy({where : { machine_id : id }});
  }

  const delMachine = await Machine.destroy({ where: { id } });
  if (delMachine > 0) {
    res.send({
      message: "Delete machine success.",
    });
  } else {
    res.send({
      message: `Cannot delete Machine with id=${id}. Maybe Machine was not found!`,
    });
  }
};

// Delete all Machine from the database.
exports.deleteAll = (req, res) => {
  Machine.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Machines were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all machines.",
      });
    });
};

// Find all published Machine
exports.findAllPublished = (req, res) => {
  Machine.findAll({ where: { status: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving machines.",
      });
    });
};

// Find a single Machine with an id
exports.findOneByCode = (req, res) => {
  const code = req.params.code;

  Machine.findOne({
    where: {
      code: code
    }
  })
    .then((data) => {
      if (data) {
        var spareparts = [];
        
        data.getParts().then((parts) => {
          for (let i = 0; i < parts.length; i++) {
            spareparts.push(
              {
                "id" : parts[i].id,
                "name" : parts[i].name,
                "standard" : parts[i].standard,
                "method" : parts[i].method,
              }
            );
          }
          var machineParts = [];
          Machine_parts.findAll({
            where: {
              machine_id: {
                [Op.eq]: data.id,
              },
            },
            attributes: [
              "id",
              "machine_id",
              "parts_id"
            ],
          }).then((machine_parts) => {
            //console.log(JSON.stringify(machine_parts,null,2));
            for (let i = 0; i < machine_parts.length; i++) {
              machineParts.push({
                id: machine_parts[i].id,
                machine_id: machine_parts[i].machine_id,
                parts_id: machine_parts[i].parts_id,
              });
            }

            //console.log(machineParts);

            const dataResponse = {
              id: data.id,
              code: data.code,
              name: data.name,
              description: data.description,
              location: data.location,
              status: data.status,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              parts: spareparts,
              machineParts: machineParts,
            };

            //console.log(dataResponse);

            res.status(200).send(dataResponse);
          });
        });
        //res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Machine with id=${code}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Machine with id=" + code,
      });
    });
};
