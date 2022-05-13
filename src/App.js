
import { useState } from 'react';
import './App.css';
// import { extendBorsh } from "./dca-program/utils/borshExtension";


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
  depositToken
  // swapFromSol,
  // swapToSol
} from "./dca-program";

// extendBorsh();



function App() {

  // class DepositTokenData {
  //   constructor(args) {
  //     this.instruction = 0;
  //     this.amount = args.amount;
  //   }
  // }

  // const depositTokenSchema = new Map([
  //   [
  //     DepositTokenData,
  //     {
  //       kind: "struct",
  //       fields: [
  //         ["instruction", "u8"],
  //         ["amount", "u64"],
  //       ],
  //     }
  //   ]
  // ]);


  // arguments
  const [dcaAddress, setDcaAddress] = useState("");

  const onDepositTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const amount = 0.5;

      const { status, data } = await depositToken(connection, owner, mint, amount);
      console.log(status);
      console.log(data.signature);
      console.log(data.dcaDataAddress);
      setDcaAddress(data.dcaDataAddress);
    } catch (e) {
      console.log(e);
    }
  }





  // const onRegularStyleDepositTokenClick = async () => {
  //   try {
  //     const fromAddress = window.solana.publicKey;
  //     const mintAddress = new PublicKey("6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY");
  //     const depositData = {
  //       amount: convertToLamports(1)
  //     };

  //     const dcaAccount = new Keypair();
  //     const [vaultAddress,] = await findDcaDerivedAddress([fromAddress.toBuffer(), dcaAccount.publicKey.toBuffer()]);
  //     const [senderAta,] = await findAssociatedTokenAddress(fromAddress, mintAddress);
  //     const [vaultAta,] = await findAssociatedTokenAddress(vaultAddress, mintAddress);
  //     const data = serialize(depositTokenSchema, new DepositTokenData(depositData));

  //     const txn = new Transaction();
  //     txn.add(new TransactionInstruction({
  //       keys: [
  //         {
  //           pubkey: fromAddress,
  //           isSigner: true,
  //           isWritable: true
  //         },
  //         {
  //           pubkey: vaultAddress,
  //           isSigner: false,
  //           isWritable: true
  //         },
  //         {
  //           pubkey: TOKEN_PROGRAM_ID,
  //           isSigner: false,
  //           isWritable: false
  //         },
  //         {
  //           pubkey: mintAddress,
  //           isSigner: false,
  //           isWritable: true
  //         },
  //         {
  //           pubkey: SystemProgram.programId,
  //           isSigner: false,
  //           isWritable: false
  //         },
  //         {
  //           pubkey: SYSVAR_RENT_PUBKEY,
  //           isSigner: false,
  //           isWritable: false
  //         },
  //         {
  //           pubkey: senderAta,
  //           isSigner: false,
  //           isWritable: true
  //         },
  //         {
  //           pubkey: vaultAta,
  //           isSigner: false,
  //           isWritable: true
  //         },
  //         {
  //           pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
  //           isSigner: false,
  //           isWritable: false
  //         },
  //         {
  //           pubkey: dcaAccount.publicKey,
  //           isSigner: true,
  //           isWritable: true
  //         },
  //       ],
  //       programId: DCA_PROGRAM_ID,
  //       data: data
  //     }));
  //     txn.feePayer = fromAddress;
  //     txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  //     txn.partialSign(dcaAccount);

  //     const signedTxn = await window.solana.signTransaction(txn);
  //     console.log(txn);
  //     console.log(signedTxn.serialize());
  //     const signature = await connection.sendRawTransaction(signedTxn.serialize());
  //     await connection.confirmTransaction(signature, "confirmed");

  //     console.log(signature);
  //     return {
  //       status: "success",
  //       data: {
  //         signature: signature,
  //         dcaDataAddress: dcaAccount.publicKey.toBase58()
  //       }
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }


  const onDepositSolClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const amount = 0.5;

      const { status, data } = await depositSol(connection, owner, mint, amount);
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
      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const amount = 0.5;
      const { status, data } = await withdrawToken(connection, owner, dcaAddress, mint, amount);
      console.log(status);
      console.log(data.signature);
    } catch (e) {
      console.log(e);
    }
  }

  const onInitializeClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const startTime = Math.floor(Date.now() + 10);
      const dcaAmount = 0.5;
      const dcaTime = Math.floor(Date.now())
      const minimumAmountOut = 0.1;
      const { status, data } = initialize(
        connection,
        owner,
        dcaAddress,
        startTime,
        dcaAmount,
        dcaTime,
        minimumAmountOut
      );
      console.log(status);
      console.log(data);

    } catch (e) {
      console.log(e);
    }
  }

  const onWithdrawSolClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const transferAmount = 0.5;
      const { status, data } = await withdrawSol(connection, owner, mint, dcaAddress, transferAmount);
      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
    }
  }

  const onFundTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const transferAmount = 0.5;
      const { status, data } = await fundToken(connection, owner, mint, dcaAddress, transferAmount);
      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
    }
  }

  const onFundSolClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const transferAmount = 0.5;
      const { status, data } = await fundSol(connection, owner, mint, dcaAddress, transferAmount);
      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="App">
      <button className='btn' onClick={getProvider}>Connect</button>
      <button className='btn' onClick={onDepositTokenClick}>Deposit Token</button>
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
