const { validationResult } = require('express-validator');
const { GetBalanceOfLatestTransfers } = require('../utils/web3Connections.utils');

exports.getBalanceOfLatestAddresses = async (req, res) => {
  console.log("dsadrrrrrsas");

    const errors = validationResult(req);

    console.log("dsadsas");

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  try {
    const balancesOfAddresses = await GetBalanceOfLatestTransfers();

    balancesOfAddresses.forEach(element => {
        console.log("Balance of address: ", element.address, " is: ", element.balance);
    });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};