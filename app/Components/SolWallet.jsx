"use client";

import { useState, useEffect } from "react";
import { derivePath } from "ed25519-hd-key";
import { Keypair, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import { mnemonicToSeedSync } from "bip39";
import Popup from "./Popup";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

const SolWallet = ({ mnemonic, wallets, setWallets }) => {
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
    const path = `m/44'/501'/${wallets.length}'/0'`; // This is the derivation path
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
    const privateKey = Buffer.from(keyPair.secretKey).toString("base64");
    const publicKey = Keypair.fromSecretKey(
      keyPair.secretKey
    ).publicKey.toBase58();
    newWallet = {
      accountNumber: wallets.length + 1,
      publicKey,
      privateKey,
      keyPair,
    };

    setWallets([...wallets, newWallet]);
    console.log(keyPair);
  };

  return (
    <>
      <div className="flex gap-4">
        <button
          onClick={addSolWallet}
          className="border mt-3 rounded-md px-9 py-3 font-semibold bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800"
        >
          Create a Solana Wallet
        </button>
      </div>
      <div className={`${wallets.length === 0 ? "hidden" : "my-5"}`}>
        <h2 className="text-3xl">{`Account Balance : ${solBalance}sol`}</h2>
      </div>
      <div className="text-black">
        {wallets.map((wallet, index) => (
          <div key={index} className="p-6 bg-white rounded-lg mt-3 border">
            <Popup
              showPopup={showPopup}
              closePopup={closePopup}
              pubKey={pubKey}
              keyPairValue={keyPairValue}
            />
            <h2 className="text-3xl my-2"> Account {wallet.accountNumber}</h2>
            <p>{wallet.privateKey}</p>
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
          </div>
        ))}
      </div>
    </>
  );
};

export default SolWallet;
