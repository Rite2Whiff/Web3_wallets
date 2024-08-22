import React from "react";

import { ethers } from "ethers";
import { mnemonicToSeedSync } from "bip39";
import hdkey from "hdkey";
import Image from "next/image";

const EthWalett = ({ mnemonic, ethWallets, setEthWallets }) => {
  const addEthWallet = () => {
    let newWallet = {};
    const seed = mnemonicToSeedSync(mnemonic);
    // Derive key from seed using the Ethereum derivation path
    const path = `m/44'/60'/${ethWallets.length}'/0'`;
    const root = hdkey.fromMasterSeed(seed);
    const addrNode = root.derive(path);
    const privateKey = addrNode.privateKey.toString("hex");
    const wallet = new ethers.Wallet(privateKey);
    newWallet = {
      accountNumber: ethWallets.length + 1,
      address: wallet.address,
      privateKey: wallet.privateKey,
    };

    setEthWallets([...ethWallets, newWallet]);
    console.log(wallet.address, mnemonic);
  };

  return (
    <div className="flex  flex-col  items-center justify-center">
      <button
        onClick={addEthWallet}
        className="border mt-3 rounded-md px-9 py-3 font-semibold bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800"
      >
        Create an Etherium Wallet
      </button>
      <div className="text-black">
        {ethWallets.map((wallet, index) => (
          <div
            key={index}
            className="p-6 relative bg-white rounded-lg mt-3 border"
          >
            <img
              className="absolute right-5 top-5"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png"
              alt=""
              width={30}
              height={30}
            />
            <h2 className="text-3xl my-2"> Account {wallet.accountNumber}</h2>
            <p className="text-xl font-semibold mb-2">{wallet.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EthWalett;
