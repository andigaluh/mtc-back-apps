const Cryptr = require("cryptr");
const config = require("../config/auth.config")
const cryptr = new Cryptr(config.secret);

encryptedString = (data) => {
  return cryptr.encrypt(data);
};

decryptedString = (encryptedData) => {
  return cryptr.decrypt(encryptedData);
};

encDec = {
    encryptedString,
    decryptedString
}

module.exports = encDec;