import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "dotenv/config"; // Добавляем эту строку для загрузки переменных из .env

const MONAD_PRIVATE_KEY = process.env.MONAD_PRIVATE_KEY;

if (!MONAD_PRIVATE_KEY) {
  throw new Error("Please set your MONAD_PRIVATE_KEY in a .env file");
}

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    monad: {
      url: "https://testnet-rpc.monad.xyz/",
      chainId: 10143,
      accounts: [MONAD_PRIVATE_KEY],
    },
  },
};

export default config;