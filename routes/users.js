const express = require('express');
const bcrypt = require('bcrypt')
const {User, validateUser, validatePassword} = require("../models/user");
const router = express.Router();

router.post('/', async (req, res, next) => {
    const {error} = validateUser(req.body)
    if (error)
        return res.status(400).send(error.message)

    const matchUser = await User.findOne({email: req.body.email})
    if (matchUser)
        return res.status(400).send('current email registered before!')

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password,salt)

    const user = await User.create({
        ...req.body,
        password: hashedPassword
    })

    const {_id, firstName, lastName, email, __v} = user

    const jwt = user.generateWebToken()
    res.header('x-auth-token',jwt).status(201).send({_id, firstName, lastName, email, __v});
});

router.post('/auth', async (req, res, next) => {
    const {email,password} = req.body
    if (!email)
        return res.status(400).send('email is required!')
    if (!password)
        return res.status(400).send('password is required!')
    const {error} = validatePassword(password)
    if (error)
        return res.status(400).send(error.message)

    const matchUser = await User.findOne({email})
    if (!matchUser)
        return res.status(400).send('email or password incorrect!')
    const matchPassword = await bcrypt.compare(password,matchUser.password)
    if (!matchPassword)
        return res.status(400).send('email or password incorrect!')

    const {_id, firstName, lastName, email: userEmail, __v} = matchUser

    const jwt = matchUser.generateWebToken()
    res.header('x-auth-token',jwt).send({_id, firstName, lastName, userEmail, __v});
});

module.exports = router;
