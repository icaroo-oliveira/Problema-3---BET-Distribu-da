require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config();

module.exports = {
  solidity: "0.8.27",
  networks: {
    ganache: {
      url: "http://localhost:7545",
      accounts: [process.env.PRIVATE_KEY_1]
    }
  }
};
