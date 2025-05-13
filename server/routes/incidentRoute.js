const express = require('express');
const router = express.Router();
const controller = require('../controllers/IncidentController');
const verify = require('../middleware/verifyUser');

router.get(
  '/allIncidents',
  verify.verifyRoles(0, 2, 3),
  controller.getIncidents
);
router.get(
  '/detail/:id',
  verify.verifyRoles(0, 2, 3),
  controller.getDetail
);
router.get(
  '/incidentCount/:month',
  verify.verifyRoles(0, 2, 3),
  controller.getNumberOfIncidentOfMonth
);

module.exports = router;
