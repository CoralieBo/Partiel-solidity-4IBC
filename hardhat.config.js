require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
		mumbai: {
			url: process.env.RPC_URL,
			accounts: [process.env.OWNER_PRIVATE_KEY, process.env.USER_PRIVATE_KEY]
		}
	},
};
