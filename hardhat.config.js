require("@nomicfoundation/hardhat-toolbox");
// const INFURA_API_KEY = vars.get("a94b2f6d8a1f41a7add8ef8147fc6b20");

// const ETHERSCAN_API_KEY = vars.get("R8AMJAR4FNZ1H5N478DHW8NQD4CQUG7NUH");
// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.27",
//   networks: {
//     localhost: {
//       url: "http://127.0.0.1:8545", // Endereço padrão para o Hardhat Network ou outra rede local
//       chainId: 31337, // Chain ID padrão para Hardhat Network
//     },
//   },etherscan: {
//     apiKey: "R8AMJAR4FNZ1H5N478DHW8NQD4CQUG7NUH",
//   },
// };




require('dotenv').config();

module.exports = {
  solidity: "0.8.27",
  networks: {
    ganache: {
      url: "http://localhost:7545",
      accounts: [process.env.PRIVATE_KEY_1, process.env.PRIVATE_KEY_2,process.env.PRIVATE_KEY_3,process.env.PRIVATE_KEY_4]
    }
  }
};
