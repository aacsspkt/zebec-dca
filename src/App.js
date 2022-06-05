import { PublicKey, SendTransactionError } from '@solana/web3.js';
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
  swapFromSol,
  swapToSol,
  DcaAccount,
  getMintInfo,
  findDcaDerivedAddress,
  findAssociatedTokenAddress,
} from "./dca-program";


function App() {
  const onDepositTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN";
      const amount = 1;

      const { status, data } = await depositToken(
        connection,
        owner,
        mint,
        amount
      );

      console.log(status);
      console.log(data.signature);
      console.log(data.dcaDataAddress);
    } catch (e) {
      console.log(e);
    }
  }


  const onDepositSolClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN";
      const amount = 2;

      const { status, data } = await depositSol(
        connection,
        owner,
        mint,
        amount
      );

      console.log(status);
      console.log(data.signature);
      console.log(data.dcaDataAddress);

    } catch (e) {
      console.log(e.message);
      console.log(e.logs)
    }
  }

  const onInitializeClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const dcaData = "3xqr93XohjuYTqq6xvzjYWn8ZJe6e1omU6KUF8Jre7Eu";
      const startTime = Math.floor(Date.now() / 1000) + (0.5 * 60); // add 0.5 min
      const dcaAmount = 1;
      const dcaTime = 3 * 60  // 3 min

      const minimumAmountOut = 1.5;

      const { status, data } = await initialize(
        connection,
        owner,
        dcaData,
        startTime,
        dcaAmount,
        dcaTime,
        minimumAmountOut
      );

      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
    }
  }


  const onWithdrawTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const dcaData = "3xqr93XohjuYTqq6xvzjYWn8ZJe6e1omU6KUF8Jre7Eu";
      const mint = "8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN";
      const amount = 208679458 / (10 ** 6);

      console.log(amount);
      const { status, data } = await withdrawToken(
        connection,
        owner,
        mint,
        dcaData,
        amount
      );

      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
      console.log(e.logs);
    }
  }


  const onWithdrawSolClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const dcaData = "46uSokKg1KWFrEC9HMp1BjrhtiA4BMuMybHBiaeyPPuJ";
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const transferAmount = 0.5;

      const { status, data } = await withdrawSol(
        connection,
        owner,
        mint,
        dcaData,
        transferAmount
      );

      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
    }
  }

  const onFundTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const dcaData = "Ay75t7vwzVbM7DazTHrEWdxfmCzUHbmxNApzxR8pSVbE";
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const transferAmount = 0.5;

      const { status, data } = await fundToken(
        connection,
        owner,
        mint,
        dcaData,
        transferAmount
      );

      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
    }
  }

  const onFundSolClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const dcaData = "3xqr93XohjuYTqq6xvzjYWn8ZJe6e1omU6KUF8Jre7Eu";
      const mint = "8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN";
      const transferAmount = 1;

      const { status, data } = await fundSol(
        connection,
        owner,
        mint,
        dcaData,
        transferAmount
      );

      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e, e.logs);
    }
  }

  const onSwapFromSolClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN";
      const dcaData = "3xqr93XohjuYTqq6xvzjYWn8ZJe6e1omU6KUF8Jre7Eu";
      const { status, data } = await swapFromSol(
        connection,
        owner,
        mint,
        dcaData
      );
      console.log(status);
      console.log(data.signature);
    } catch (e) {
      console.log(e, e.logs);
    }
  }

  const onSwapToSolClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN";
      const dcaData = "BVjnBmnrQPuZ6oxSZuCjsHEPj9GFnv9gZGEjn1LVLvaM";
      const { status, data } = await swapToSol(
        connection,
        owner,
        mint,
        dcaData
      );
      console.log(status);
      console.log(data.signature);
    } catch (e) {
      console.log(e);
    }
  }

  const onGetWithdrawableTokenBalanceClicked = async () => {
    try {
      const owner = window.solana.publicKey;
      const mint = new PublicKey("8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN");
      const dcaDataAddress = new PublicKey("3xqr93XohjuYTqq6xvzjYWn8ZJe6e1omU6KUF8Jre7Eu");
      const [vault,] = await findDcaDerivedAddress([owner.toBuffer(), dcaDataAddress.toBuffer()]);
      const [vaultAToken,] = await findAssociatedTokenAddress(vault, mint);
      const response = await connection.getTokenAccountBalance(vaultAToken, "finalized");
      console.log(`Withdrawable Balance of ${vaultAToken.toString()}: ${response.value.amount}`);
    } catch (e) {
      console.log(e);
    }
  }

  const onDcaDataClick = async () => {
    try {
      const dcaDataAddress = "3xqr93XohjuYTqq6xvzjYWn8ZJe6e1omU6KUF8Jre7Eu";
      let dcaAccount = await connection.getAccountInfo(new PublicKey(dcaDataAddress), "confirmed");
      let dcaData = DcaAccount.decodeUnchecked(dcaAccount.data)
      console.log("Dca Account Data",
        `total amount: ${dcaData.totalAmount.toString()},
        dca amount: ${dcaData.dcaAmount.toString()},
        dca time: ${dcaData.dcaTime.toString()},
        start time: ${dcaData.startTime.toString()},
        minimumAmountOut: ${dcaData.minimumAmountOut.toString()},
        is initialized: ${dcaData.state.toString()}`
      );
    } catch (e) {
      console.log("error: ", e);
    }
  }

  const onGetMintInfoClick = async () => {
    try {
      const address = "8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN";
      const mintInfo = await getMintInfo(connection, new PublicKey(address));
      console.log(mintInfo);
    } catch (e) {
      console.log(e);
    }
  }

  console.log()

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
      <button className='btn' onClick={onSwapFromSolClick}>Swap From Sol</button>
      <button className='btn' onClick={onSwapToSolClick}>Swap To Sol</button>
      <button className='btn' onClick={onDcaDataClick}>Get Dca Account Data</button>
      <button className='btn' onClick={onGetMintInfoClick}>Get Mint Info Data</button>
      <button className='btn' onClick={onGetWithdrawableTokenBalanceClicked}>Get Token Balance</button>
    </div>
  );
}


export default App;
