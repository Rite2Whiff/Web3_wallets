"use client";

import { useState } from "react";
import { derivePath } from "ed25519-hd-key";
import { Keypair, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import { mnemonicToSeedSync } from "bip39";
import Popup from "./Popup";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

const SolWallet = ({ mnemonic, solWallets, setSolWallets }) => {
  const [solBalance, setSolBalance] = useState(" ");
  const [showPopup, setShowPopup] = useState(false);
  const [pubKey, setPubKey] = useState(null);
  const [keyPairValue, setKeyPairValue] = useState(null);

  const handleClick = (publicKey, keyPair) => {
    openPopup();
    setPubKey(publicKey);
    setKeyPairValue(keyPair);
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const requestAirDrop = async (publicKeyString) => {
    try {
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );
      const myAddress = new PublicKey(publicKeyString);
      const airDropSignature = await connection.requestAirdrop(
        myAddress,
        LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(airDropSignature);
      console.log("Airdrop recieved");
    } catch (error) {
      console.log("error", error);
    }
  };

  const getAccountBalance = async (publicKey) => {
    const url = "https://api.devnet.solana.com";
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const body = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [publicKey],
    });

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const data = await response.json();
    const {
      result: { value },
    } = data;
    setSolBalance(value / 10 ** 9);
  };

  const addSolWallet = () => {
    let newWallet = {};
    const seed = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/501'/${solWallets.length}'/0'`; // This is the derivation path
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
    const privateKey = Buffer.from(keyPair.secretKey).toString("base64");
    const publicKey = Keypair.fromSecretKey(
      keyPair.secretKey
    ).publicKey.toBase58();
    newWallet = {
      accountNumber: solWallets.length + 1,
      publicKey,
      privateKey,
      keyPair,
    };

    setSolWallets([...solWallets, newWallet]);
    console.log(keyPair);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={addSolWallet}
        className="border mt-3 rounded-md px-9 py-3 font-semibold bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800"
      >
        Create a Solana Wallet
      </button>
      <div className="text-black ">
        {solWallets.map((wallet, index) => (
          <div
            key={index}
            className="p-6 relative bg-white rounded-lg mt-3 border"
          >
            <img
              className="absolute right-5 top-5"
              src="https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png"
              alt=""
              width={50}
              height={50}
            />
            <Popup
              showPopup={showPopup}
              closePopup={closePopup}
              pubKey={pubKey}
              keyPairValue={keyPairValue}
            />
            <h2 className="text-3xl my-2"> Account {wallet.accountNumber}</h2>
            <p className="text-xl font-semibold mb-2">{wallet.publicKey}</p>
            <button
              onClick={() => getAccountBalance(wallet.publicKey)}
              className="border text-white mt-3 rounded-md px-9 py-3 font-semibold bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800"
            >
              Show Wallet Balance
            </button>
            <button
              onClick={() => handleClick(wallet.publicKey, wallet.keyPair)}
              className="border ml-3 text-white mt-3 rounded-md px-9 py-3 font-semibold bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800"
            >
              Send Sol
            </button>
            <button
              onClick={() => requestAirDrop(wallet.publicKey)}
              className="border ml-3 text-white mt-3 rounded-md px-9 py-3 font-semibold bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800"
            >
              Request Airdrop
            </button>
            <p className="mt-2 text-3xl">{`Account Balance : ${solBalance}sol`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolWallet;
