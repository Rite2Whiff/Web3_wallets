"use client";

import { useState } from "react";
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

export default function Home() {
  const [wallets, setWallets] = useState([]);
  const [mnemonic, setMnemonic] = useState([]);
  const [mnemonicArray, setMnemonicArray] = useState([]);

  const generateMnemonicPhrase = () => {
    const mnemonic = generateMnemonic();
    setMnemonic(mnemonic);
    let resultArray = mnemonic.split();
    resultArray = resultArray[0].split(" ");
    setMnemonicArray(resultArray);
    setWallets([]);
  };

  const addWallet = () => {
    let newWallet = {};
    const seed = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/501'/${wallets.length}'/0'`; // This is the derivation path
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const newPublicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
    newWallet = {
      publicKey: newPublicKey,
    };
    setWallets([...wallets, newWallet]);
    console.log({ newWallet, mnemonic });
  };

  return (
    <main className="bg-blue-500">
      <div className="min-h-screen max-w-screen-xl mx-auto flex flex-col items-center">
        <h1 className="text-white text-3xl mt-[50px] font-bold font-serif">
          Welcome to newbieWallet
        </h1>
        <button
          onClick={generateMnemonicPhrase}
          className="border mt-3 rounded-md px-9 py-3 font-semibold bg-teal-400"
        >
          Generate a random phrase
        </button>
        <div>
          <ul>
            {mnemonicArray.map((item, index) => {
              return <li key={index}>{item}</li>;
            })}
          </ul>
        </div>
        <button
          onClick={addWallet}
          className={`${
            mnemonic.length === 0
              ? "hidden"
              : "border mt-3 rounded-md px-9 py-3 font-semibold bg-teal-400"
          }`}
        >
          Generate public key
        </button>
        <div>
          {wallets.map((wallet, index) => (
            <div key={index} className="p-6 bg-white rounded-lg mt-3 border">
              <h2 className="text-xl font-semibold mb-2">{wallet.publicKey}</h2>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
