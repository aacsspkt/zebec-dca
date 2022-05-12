
import { useState } from 'react';
import './App.css';
import { extendBorsh } from "./dca-program/utils/borshExtension";


import {
  connection,
  getProvider,
  // depositToken,
  depositSol,
  withdrawSol,
  withdrawToken,
  fundSol,
  fundToken,
  initialize,
  findDcaDerivedAddress,
  findAssociatedTokenAddress,
  DCA_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  SYSVAR_RENT_PUBKEY
  // swapFromSol,
  // swapToSol
} from "./dca-program";
import { convertToLamports } from './dca-program/utils';
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { serialize } from 'borsh';

extendBorsh();



function App() {

  class DepositTokenData {
    constructor(args) {
      this.instruction = 0;
      this.amount = args.amount;
    }
  }

  const depositTokenSchema = new Map([
    [
      DepositTokenData,
      {
        kind: "struct",
        fields: [
          ["instruction", "u8"],
          ["amount", "u64"],
        ],
      }
    ]
  ]);


  const [dcaAddress, setDcaAddress] = useState("");

  // const onDepositTokenClick = async () => {
  //   try {
  //     const { status, data } = await depositToken({
  //       connection: connection,
  //       fromAddress: window.solana.publicKey.toBase58(),
  //       mintAddress: "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY",
  //       amount: 1
  //     });
  //     console.log(status);
  //     console.log(data.signature);
  //     console.log(data.dcaDataAddress);
  //     setDcaAddress(data.dcaDataAddress);

  //   } catch (e) {
  //     console.log(e);
  //   }
  // }





  const onRegularStyleDepositTokenClick = async () => {
    try {
      const fromAddress = window.solana.publicKey;
      const mintAddress = new PublicKey("6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY");
      const depositData = {
        amount: convertToLamports(1)
      };

      const dcaAccount = new Keypair();
      const [vaultAddress,] = await findDcaDerivedAddress([fromAddress.toBuffer(), dcaAccount.publicKey.toBuffer()]);
      const [senderAta,] = await findAssociatedTokenAddress(fromAddress, mintAddress);
      const [vaultAta,] = await findAssociatedTokenAddress(vaultAddress, mintAddress);
      const data = serialize(depositTokenSchema, new DepositTokenData(depositData));

      const txn = new Transaction();
      txn.add(new TransactionInstruction({
        keys: [
          {
            pubkey: fromAddress,
            isSigner: true,
            isWritable: true
          },
          {
            pubkey: vaultAddress,
            isSigner: false,
            isWritable: true
          },
          {
            pubkey: TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false
          },
          {
            pubkey: mintAddress,
            isSigner: false,
            isWritable: true
          },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false
          },
          {
            pubkey: SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false
          },
          {
            pubkey: senderAta,
            isSigner: false,
            isWritable: true
          },
          {
            pubkey: vaultAta,
            isSigner: false,
            isWritable: true
          },
          {
            pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false
          },
          {
            pubkey: dcaAccount.publicKey,
            isSigner: true,
            isWritable: true
          },
        ],
        programId: DCA_PROGRAM_ID,
        data: data
      }));
      txn.feePayer = fromAddress;
      txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      txn.partialSign(dcaAccount);

      const signedTxn = await window.solana.signTransaction(txn);
      console.log(txn);
      console.log(signedTxn.serialize());
      const signature = await connection.sendRawTransaction(signedTxn.serialize());
      await connection.confirmTransaction(signature, "confirmed");

      console.log(signature);
      return {
        status: "success",
        data: {
          signature: signature,
          dcaDataAddress: dcaAccount.publicKey.toBase58()
        }
      }
    } catch (e) {
      console.log(e);
    }
  }


  const onDepositSolClick = async () => {
    try {
      const { status, data } = await depositSol({
        connection: connection,
        fromAddress: window.solana.publicKey.toBase58(),
        mintAddress: "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY",
        amount: 1
      });
      console.log(status);
      console.log(data.signature);
      console.log(data.dcaDataAddress);
      setDcaAddress(data.dcaDataAddress);

    } catch (e) {
      console.log(e);
    }
  }

  const onWithdrawTokenClick = async () => {
    try {
      const { status, data } = await withdrawToken({
        connection: connection,
        fromAddress: window.solana.publicKey.toBase58(),
        mintAddress: "",
        dcaDataAddress: dcaAddress,
        transferAmount: 0.5
      });
      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
    }
  }

  const onInitializeClick = async () => {
    try {
      const { status, data } = initialize({
        connection: connection,
        fromAddress: window.solana.publicKey.toBase58(),
        dcaDataAddress: dcaAddress,
        startTime: Math.floor(Date.now() + 10),
        dcaAmount: 0.5,
        dcaTime: Math.floor(),
        minimumAmountOut: 0.5
      });
      console.log(status);
      console.log(data);

    } catch (e) {
      console.log(e);
    }
  }

  const onWithdrawSolClick = async () => {
    try {
      const { status, data } = await withdrawSol({
        connection: connection,
        fromAddress: window.solana.publicKey.toBase58(),
        mintAddress: "",
        dcaDataAddress: dcaAddress,
        transferAmount: 0.5
      });
      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
    }
  }

  const onFundTokenClick = async () => {
    try {
      const { status, data } = await fundToken({
        connection: connection,
        fromAddress: window.solana.publicKey.toBase58(),
        mintAddress: "",
        dcaDataAddress: dcaAddress,
        transferAmount: 0.5
      })
      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
    }
  }

  const onFundSolClick = async () => {
    try {
      const { status, data } = await fundSol({
        connection: connection,
        fromAddress: window.solana.publicKey.toBase58(),
        mintAddress: "",
        dcaDataAddress: dcaAddress,
        transferAmount: 0.5
      })
      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="App">
      <button className='btn' onClick={getProvider}>Connect</button>
      <button className='btn' onClick={onRegularStyleDepositTokenClick}>Deposit Token</button>
      <button className='btn' onClick={onDepositSolClick}>Deposit Sol</button>
      <button className='btn' onClick={onInitializeClick}>Initialize</button>
      <button className='btn' onClick={onWithdrawTokenClick}>Withdraw Token</button>
      <button className='btn' onClick={onWithdrawSolClick}>Withdraw Sol</button>
      <button className='btn' onClick={onFundTokenClick}>Fund Token</button>
      <button className='btn' onClick={onFundSolClick}>Fund Sol</button>
    </div>
  );
}


export default App;
