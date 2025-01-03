const bcrypt = require('bcrypt')

const hashedValue = {
    async generatehashPass(password) {
        const saltRounds = 10
        const hashedPasswords = await bcrypt.hash(password, saltRounds);
        return hashedPasswords
    },
    async comparehashPass(password,Password){
        const isPasswordMatch = await bcrypt.compare(password, Password)
    return isPasswordMatch
    }
}

module.exports = {
    hashedValue
}