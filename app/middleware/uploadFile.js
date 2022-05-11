const multer = require("multer");

const imageFilter = (req, file, cb) => {
  const splitUrl = req.url.split("/");
  const urlPathName = splitUrl[1];

  if (
    !file.originalname.match(
      /\.(pdf|doc|docx|xls|xlsx|png|jpg|jpeg|gif|zip|rar|ppt|pptx)$/
    )
  ) {
    return cb(
      new Error(
        "Please upload only file with extension pdf|doc|docx|xls|xlsx|png|jpg|jpeg|gif|zip|rar|ppt|pptx"
      ),
      false
    );
  }

  cb(undefined, true);
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const splitUrl = req.url.split("/");
    const urlPathName = splitUrl[1];
    cb(
      null,
      //__basedir + "/resources/static/assets/uploads/" + splitUrl[1] + "/"
      __basedir + "/resources/static/assets/uploads/"
    );
  },
  filename: (req, file, cb) => {
    const imageName = `${Date.now()}-${file.originalname}`;
    cb(null, imageName.toLowerCase());
  },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;
