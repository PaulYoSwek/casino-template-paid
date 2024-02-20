const express = require('express');
const router = express.Router();
const { getBalanceOfLatestAddresses } = require('../../controllers/apiTestsPaulBerkhof');

router.get(
  '/getBalanceOfLatestAddresses',
  getBalanceOfLatestAddresses,
);

module.exports = router;
