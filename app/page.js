"use client";

import { useState } from "react";
import { generateMnemonic } from "bip39";
import SolWallet from "./Components/SolWallet";
import EthWalett from "./Components/EthWalett";

export default function Home() {
  const [mnemonicArray, setMnemonicArray] = useState([]);
  const [mnemonic, setMnemonic] = useState(" ");
  const [solWallets, setSolWallets] = useState([]);
  const [ethWallets, setEthWallets] = useState([]);

  const generateMnemonicPhrase = () => {
    const mnemonic = generateMnemonic();
    setMnemonic(mnemonic);
    let resultArray = mnemonic.split();
    resultArray = resultArray[0].split(" ");
    setMnemonicArray(resultArray);
    setSolWallets([]);
    setEthWallets([]);
  };

  return (
    <main className>
      <div className="min-h-screen flex flex-col items-center">
        <h1 className="text-white text-3xl mt-[50px] font-bold font-serif">
          Phatnom Wallet
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
        <section className="flex w-11/12 justify-between">
          <div
            className={`${
              mnemonicArray.length === 0
                ? "hidden"
                : "flex flex-col w-1/2 items-center"
            }`}
          >
            <SolWallet
              mnemonic={mnemonic}
              solWallets={solWallets}
              setSolWallets={setSolWallets}
            />
          </div>
          <div
            className={`${
              mnemonicArray.length === 0
                ? "hidden"
                : "flex flex-col w-1/2  items-center"
            }`}
          >
            <EthWalett
              mnemonic={mnemonic}
              ethWallets={ethWallets}
              setEthWallets={setEthWallets}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
