"use client";

import { Keypair } from "@solana/web3.js";
import { generateMnemonic } from "bip39";
import { useState } from "react";
import bs58 from "bs58";

type walletType = {
  publicKey: string;
  secretKey: string;
  seeds: string[];
};

function WalletCard({ data }: { data: walletType }) {
  return (
    <div className="w-full p-5 rounded-md bg-white/10">
      <div className="w-full flex flex-col gap-5">
        {/* public key */}
        <div className="flex flex-col gap-2">
          <p className="text-sm">Public Key</p>
          <p>{data.publicKey}</p>
        </div>

        {/* secret key */}
        <div className="flex flex-col gap-2">
          <p className="text-sm">Secret Key</p>
          <p>{data.secretKey}</p>
        </div>

        {/* Seeds */}
        <div className="flex w-full flex-col gap-2">
          <p className="text-sm">Seeds</p>
          <div className="w-full grid gap-5 grid-cols-4">
            {data.seeds.map((seed, index) => (
              <div
                key={index}
                className=" w-full flex justify-center items-center p-2 bg-white/20"
              >
                <p>{seed}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [wallets, setWallets] = useState<walletType[]>([]);

  function createWalletHandler() {
    const { publicKey, secretKey } = Keypair.generate();
    const mnemonic = generateMnemonic();
    const secretKeyBase58 = bs58.encode(secretKey);

    const payload = {
      publicKey: publicKey.toBase58(),
      secretKey: secretKeyBase58,
      seeds: mnemonic.split(" "),
    };

    setWallets((prev) => [...prev, payload]);
  }

  return (
    <div className="w-full flex justify-center text-white bg-black items-center">
      <div className="min-h-screen w-10/12 py-10">
        {/* title | create button */}
        <div className="w-full flex justify-start items-start flex-col gap-5">
          {/* title */}
          <div className="border-b-2">
            <p className="text-4xl font-bold">Cohort Assignment</p>
          </div>

          {/* button */}
          <div className="flex w-full justify-end">
            <button
              onClick={createWalletHandler}
              className="bg-white/[12%] px-8 py-3 font-semibold rounded-md"
            >
              Create Wallet
            </button>
          </div>
        </div>

        {/* wallets */}
        <div className="w-full flex mt-10 flex-col gap-10">
          {wallets.map((wallet, index) => {
            return <WalletCard key={index} data={wallet} />;
          })}
        </div>
      </div>
    </div>
  );
}
