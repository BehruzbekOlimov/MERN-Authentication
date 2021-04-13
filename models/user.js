const mongoose = require('mongoose')
const Joi = require('joi')
const passwordValidator = require('password-validator')
const jsonwebtoken = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 2,
        maxlength: 40,
        required: true
    },
    lastName: {
        type: String,
        minlength: 2,
        maxlength: 40,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
})

userSchema.methods.generateWebToken = function () {
    return jsonwebtoken.sign({id: this._id}, process.env.PRIVATE_KEY);
}

const User = mongoose.model('User', userSchema)

function validateUser(user) {
    const validateSchema = Joi.object({
        firstName: Joi.string().min(2).max(40).required(),
        lastName: Joi.string().min(2).max(40).required(),
        email: Joi.string().email(),
        password: Joi.string().required(),
    })
    const passValid = validatePassword(user.password)
    if (passValid.error)
        return passValid
    return validateSchema.validate(user)
}

function validatePassword(password) {
    const passSchema = new passwordValidator()
    passSchema
        .is().min(8)
        .is().max(128)
        .has().uppercase(2)
        .has().lowercase()
        .has().symbols()
        .has().digits(2)
        .has().not().spaces()
    const errors = passSchema.validate(password, {list: true})
    if (errors.length)
        return {
            error: {
                message: {
                    conditions: 'min length: 8,max length: 128,min uppercase count: 2,min lowercase count: 1,min lowercase count: 1,min symbols count: 1,not spaces',
                    errors
                }
            }
        }
    return {error: false}
}

module.exports.User = User
module.exports.validateUser = validateUser
module.exports.validatePassword = validatePassword

