"use client";

import { useState } from "react";
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

export default function Home() {
  const [wallets, setWallets] = useState([]);
  const [mnemonic, setMnemonic] = useState([]);

  const generateMnemonicPhrase = () => {
    const mnemonic = generateMnemonic().split();
    const resultArray = mnemonic[0].split(" ");
    setMnemonic(resultArray);
    return resultArray;
  };

  const generateKeyPairs = () => {
    setWallets(wallets.pop());
    const mnemonicPhrase = generateMnemonicPhrase();
    if (mnemonicPhrase) {
      let newWallett = {};
      const mnemonic = generateMnemonic();
      const seed = mnemonicToSeedSync(mnemonic);
      for (let i = 0; i < 50; i++) {
        const path = `m/44'/501'/${i}'/0'`; // This is the derivation path
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const newPublicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
        newWallett = {
          publicKey: newPublicKey,
        };
      }
      setWallets([...wallets, newWallett]);
    } else {
      console.log("please generate a random phrase");
    }
  };

  return (
    <main className="bg-blue-500">
      <div className="min-h-screen max-w-screen-xl mx-auto flex flex-col items-center">
        <h1 className="text-white text-3xl mt-[50px] font-bold font-serif">
          Welcome to newbieWallet
        </h1>
        <button
          onClick={generateMnemonicPhrase}
          className="border mt-3 rounded-md px-3 py-3 font-semibold bg-teal-400"
        >
          Generate a random phrase
        </button>
        <button
          onClick={generateKeyPairs}
          className="border mt-3 rounded-md px-3 py-3 font-semibold bg-teal-400"
        >
          Generate public key
        </button>
        <div>
          <ul className="grid grid-cols-4 gap-4 my-4 ">
            {mnemonic.map((item, index) => {
              return (
                <li className=" text- center inline-block px-5 " key={index}>
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
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
