const express = require('express');
const router = express.Router();

const views = require('./routes.view');
const user = require('./routes.user');
const folder = require('./route.folder')


router.use('/', views)
router.use('/', user)
router.use('/', folder)

module.exports = router