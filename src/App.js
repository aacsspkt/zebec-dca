import { useState } from 'react';
import './App.css';
import {
  connection,

  getProvider,
  depositToken,
  depositSol,
  withdrawSol,
  withdrawToken,
  fundSol,
  fundToken,
  initialize,
  // swapFromSol,
  // swapToSol
} from "./dca-program";

function App() {

  const [dcaAddress, setDcaAddress] = useState("");

  const onDepositTokenClick = async () => {
    try {
      const { status, data } = await depositToken({
        connection: connection,
        fromAddress: window.solana.publicKey,
        mintAddress: "E8nLUMPzHnhPH3ygEqWow3RMzJL1zgonm3qfYube9kPr",
        amount: 0.5
      });
      console.log(status);
      console.log(data.signature);
      console.log(data.dcaDataAddress);
      setDcaAddress(data.dcaDataAddress);

    } catch (e) {
      console.log(e);
    }
  }


  const onDepositSolClick = async () => {
    try {
      const { status, data } = await depositSol({
        connection: connection,
        fromAddress: window.solana.publicKey,
        mintAddress: "",
        amount: 0.5
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
        fromAddress: window.solana.publicKey,
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
        fromAddress: window.solana.publicKey,
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
        fromAddress: window.solana.publicKey,
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
        fromAddress: window.solana.publicKey,
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
        fromAddress: window.solana.publicKey,
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
