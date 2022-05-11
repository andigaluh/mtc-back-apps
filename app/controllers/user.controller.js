exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.operatorBoard = (req, res) => {
  res.status(200).send("Operator Content.");
};

exports.supervisorBoard = (req, res) => {
  res.status(200).send("Supervisor Content." + req.userId);
};

exports.engineerBoard = (req, res) => {
  res.status(200).send("Engineer Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

