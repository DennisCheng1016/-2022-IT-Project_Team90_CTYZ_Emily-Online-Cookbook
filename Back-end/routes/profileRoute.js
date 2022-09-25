const express = require('express')
const profileRouter = express.Router()
const { updateName } = require('../controllers/profileController')

profileRouter.route('/:id').patch(updateName)

module.exports = profileRouter
