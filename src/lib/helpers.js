const bcrypt = require("bcryptjs");
const helpers = {};

helpers.encryptpassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.matchpassword = async (password, savedpasword) => {
    try {
        return await bcrypt.compare(password, savedpasword);
    } catch(e) {
        console.log(e);
    }
};

module.exports = helpers;