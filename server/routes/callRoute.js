const express = require('express');
const router = express.Router();
const controller = require('../controllers/HovorController.js');
const verify = require('../middleware/verifyUser');

router.get(
  '/allCalls',
  verify.verifyRoles(0, 2, 3),
  controller.getHovori
);
router.get(
  '/detail/:id',
  verify.verifyRoles(0, 2, 3),
  controller.getDetail
);

module.exports = router;
