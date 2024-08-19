"use client";

import { useState } from "react";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import SolWallet from "./Components/SolWallet";

export default function Home() {
  const [mnemonicArray, setMnemonicArray] = useState([]);
  const [mnemonic, setMnemonic] = useState(" ");
  const [wallets, setWallets] = useState([]);

  const generateMnemonicPhrase = () => {
    const mnemonic = generateMnemonic();
    setMnemonic(mnemonic);
    let resultArray = mnemonic.split();
    resultArray = resultArray[0].split(" ");
    setMnemonicArray(resultArray);
    setWallets([]);
  };

  return (
    <main className>
      <div className="min-h-screen max-w-screen-xl  mx-auto flex flex-col items-center">
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
        <section
          className={`${
            mnemonicArray.length === 0
              ? "hidden"
              : "flex flex-col justify-center items-center"
          }`}
        >
          <SolWallet
            mnemonic={mnemonic}
            wallets={wallets}
            setWallets={setWallets}
          />
        </section>
      </div>
    </main>
  );
}
