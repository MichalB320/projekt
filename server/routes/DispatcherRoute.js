const express = require('express');
const router = express.Router();
const controller = require('../controllers/DispecerController.js');
const verify = require('../middleware/verifyUser');

router.get(
  '/allDispatchers',
  verify.verifyRoles(0, 2, 3),
  controller.getDispeceri
);
router.get(
  '/errorRate/:id',
  verify.verifyRoles(0, 2, 3),
  controller.getChybovostDispecera
);
router.get(
  '/errorcount/:month',
  verify.verifyRoles(0, 2, 3),
  controller.getPocetChybDispecerovZaMesiac
);

module.exports = router;
