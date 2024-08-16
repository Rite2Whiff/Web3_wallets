"use client";

import { useState } from "react";
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

export default function Home() {
  const [solWallets, setSolWallets] = useState([]);
  const [mnemonic, setMnemonic] = useState("");
  const [solBalance, setSolBalance] = useState("");
  const [mnemonicArray, setMnemonicArray] = useState([]);

  const getAccountBalance = async (publicKey) => {
    const url =
      "https://solana-mainnet.g.alchemy.com/v2/gaa2ERXP5hZrtEaEkCmUVBkHzhlLvw8T";
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const body = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [`${publicKey}`],
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

    console.log({ publicKey, solBalance });
  };

  const generateMnemonicPhrase = () => {
    const mnemonic = generateMnemonic();
    setMnemonic(mnemonic);
    let resultArray = mnemonic.split();
    resultArray = resultArray[0].split(" ");
    setMnemonicArray(resultArray);
    setSolWallets([]);
  };

  const addSolWallet = () => {
    let newWallet = {};
    const seed = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/501'/${solWallets.length}'/0'`; // This is the derivation path
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const newPublicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
    newWallet = {
      accountNumber: solWallets.length + 1,
      publicKey: newPublicKey,
    };
    setSolWallets([...solWallets, newWallet]);
  };

  return (
    <main className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="min-h-screen max-w-screen-xl mx-auto flex flex-col items-center">
        <h1 className="text-white text-3xl mt-[50px] font-bold font-serif">
          Welcome to newbieWallet
        </h1>
        <button
          onClick={generateMnemonicPhrase}
          className="border mt-3 rounded-md px-9 py-3 font-semibold bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800"
        >
          Generate a random phrase
        </button>
        <div>
          <ul className="grid grid-cols-4 py-5 gap-7">
            {mnemonicArray.map((item, index) => {
              return (
                <li key={index}>
                  {index + 1}. {item}
                </li>
              );
            })}
          </ul>
        </div>
        <button
          onClick={addSolWallet}
          className={`${
            mnemonicArray.length === 0
              ? "hidden"
              : "border mt-3 rounded-md px-9 py-3 font-semibold bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800"
          }`}
        >
          Create a Solana Wallet
        </button>
        <div className="my-5">
          <h2 className="text-3xl">{`Account Balance : ${solBalance}sol`}</h2>
        </div>
        <div className="text-black">
          {solWallets.map((wallet, index) => (
            <div key={index} className="p-6 bg-white rounded-lg mt-3 border">
              <h2 className="text-3xl my-2"> Account {wallet.accountNumber}</h2>
              <p className="text-xl font-semibold mb-2">{wallet.publicKey}</p>
              <button
                onClick={() => getAccountBalance(wallet.publicKey)}
                className="border text-white mt-3 rounded-md px-9 py-3 font-semibold bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800"
              >
                Show Wallet Balance
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
