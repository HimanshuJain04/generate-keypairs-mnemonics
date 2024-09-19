"use client";

import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import React, { useState } from "react";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";

type walletType = {
  publicKey: string;
  secretKey: string;
  index: number;
};

export default function HDWalletPage() {
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [wallets, setWallets] = useState<walletType[]>([]);

  function createWalletHandler() {
    // if not then generate
    if (!mnemonic) {
      const generatedMnemonic = generateMnemonic();
      setMnemonic(generatedMnemonic);
    }

    if (mnemonic) {
      const walletNumber = wallets.length;
      const seed = mnemonicToSeedSync(mnemonic);
      const path = `m/44'/501'/${walletNumber}'/0'`; // This is the derivation path
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const publickey = Keypair.fromSecretKey(secret).publicKey.toBase58();

      const payload = {
        publicKey: publickey,
        secretKey: "",
        index: walletNumber,
      };

      setWallets([...wallets, payload]);
    }
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div className="min-h-screen  flex text-white flex-col gap-8 py-10 w-10/12">
        {/* title */}
        <div>
          <p className="text-4xl text-center font-bold">HD Wallet</p>
        </div>

        {/* button */}
        <div className="flex justify-end w-full">
          <button
            onClick={createWalletHandler}
            className="bg-white/[12%] px-8 py-3 font-semibold rounded-md"
          >
            Create Wallet
          </button>{" "}
        </div>

        {/* showing mnemonics */}
        {mnemonic && (
          <div>
            <div className="w-full grid grid-cols-4 p-8 rounded-md border border-white gap-8">
              {mnemonic.split(" ").map((value, index) => (
                <div
                  key={index}
                  className=" w-full flex items-center p-3 rounded-sm bg-white/10"
                >
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* wallets */}
        {wallets.length > 0 && (
          <div className="w-full flex flex-col gap-8">
            {wallets.map((wallet, index) => (
              <div key={index} className="p-5 bg-white/10 w-full">
                <div className="flex flex-col gap-5 w-full">
                  <span>Public Key: </span>
                  <span>{wallet.publicKey}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
