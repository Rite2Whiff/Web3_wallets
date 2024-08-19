"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  PublicKey,
  Keypair,
} from "@solana/web3.js";

const Popup = ({ showPopup, closePopup, keyPair, publicKey }) => {
  const [recipentAddress, setRecipentAddress] = useState("");
  const [solAmount, setSolAmmount] = useState("");

  const sendSol = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const recipentKey = new PublicKey(recipentAddress);
    const pubKey = new PublicKey(publicKey);

    console.log(keyPair, pubKey, recipentKey);

    const transferInstruction = SystemProgram.transfer({
      fromPubkey: pubKey,
      toPubkey: recipentKey,
      lamports: solAmount * LAMPORTS_PER_SOL,
    });

    const transaction = new Transaction().add(transferInstruction);

    const transferSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [keyPair]
    );

    await connection.confirmTransaction(transferSignature);
  };

  return (
    <Dialog open={showPopup} onClose={closePopup} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="flex ">
                <div className="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    Send Solana
                  </DialogTitle>
                  <div className="mt-2">
                    <form className="flex justify-center flex-col gap-3">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                          Recipent Address :
                        </span>
                        <input
                          id="text"
                          name="text"
                          type="text"
                          placeholder="Enter recipent's public key"
                          className="block outline-none flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          value={recipentAddress}
                          onChange={(e) => setRecipentAddress(e.target.value)}
                        />
                      </div>
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                          Amount :
                        </span>
                        <input
                          id="number"
                          name="number"
                          type="number"
                          placeholder=""
                          className="block outline-none flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          value={solAmount}
                          onChange={(e) => setSolAmmount(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm  sm:w-auto"
                        onClick={sendSol}
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default Popup;
