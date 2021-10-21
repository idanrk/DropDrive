const validator = require('validator')

function validate(user) {
    const error = {}
    if (user.email) {
        if (!validator.isEmail(user.email)) {
            error.email = "Invalid Email"
        }
    }
    if (user.password) {
        const valPass = validator.trim(user.password)
        if (valPass !== user.password || valPass.length < 8) {
            error.password = "Password mustn't contain spaces and have minimum 8 letters"
        }
    }
    if (user.username) {
        if (user.username.includes(' ') || user.username.length < 4) {
            error.username = "Username mustn't contain spaces and have minimum 4 letters"
        }
    }
    if (user.firstname) {
        if (user.firstname.includes(' ')) {
            error.firstname = "Username mustn't contain spaces"
        }
    }
    if (user.lastname) {
        if (user.lastname.includes(' ')) {
            error.lastname = "Last name mustn't contain spaces"
        }
    }
    return error
}
module.exports = validate