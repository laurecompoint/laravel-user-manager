var mongoose = require('mongoose')
var Schema = mongoose.Schema

var bcrypt = require('bcrypt')

var UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

UserSchema.methods.passwordHash = function (password) {
    return this.password = bcrypt.hashSync(password, 12)
}
UserSchema.methods.passwordVerify = function (password) {
    return this.password = bcrypt.compareSync(password, this.password)
}
module.exports = mongoose.model('User', UserSchema)
