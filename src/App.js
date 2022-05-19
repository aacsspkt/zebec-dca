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
  fetchAllPoolKeys
} from "./dca-program";

function App() {

  const onDepositTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const amount = 0.5;

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
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const amount = 0.5;

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
      console.log(e);
    }
  }

  const onInitializeClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const dcaData = "46uSokKg1KWFrEC9HMp1BjrhtiA4BMuMybHBiaeyPPuJ";
      const startTime = Math.floor(Date.now() + 10);
      const dcaAmount = 0.3;
      const dcaTime = Math.floor(Date.now())
      const minimumAmountOut = 0.01;

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
      console.log(data);

    } catch (e) {
      console.log(e);
    }
  }


  const onWithdrawTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const dcaData = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const amount = 0.5;

      const { status, data } = await withdrawToken(
        connection,
        owner,
        dcaData,
        mint,
        amount
      );

      console.log(status);
      console.log(data.signature);

    } catch (e) {
      console.log(e);
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
      const dcaData = "3v3pd5DiajA111RfZ8RMcMzqxC3kFd3jRodNeLFPpokP";
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
      const dcaData = "3v3pd5DiajA111RfZ8RMcMzqxC3kFd3jRodNeLFPpokP";
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";
      const transferAmount = 0.5;

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
      console.log(e);
    }
  }

  const onSwapFromSolClick = async () => {
    try {

      // const poolKeysList = Liquidity.fetchAllPoolKeys(); // not working right now
      const poolKeysList = await fetchAllPoolKeys();
      if (!poolKeysList) {
        throw Error("Some error occured in fetching pool keys.")
      }
      const [poolKeys,] = poolKeysList.filter(el => el.quoteMint === "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" &&
        el.baseMint === "So11111111111111111111111111111111111111112");

      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";

      const accounts = await swapFromSol(
        connection,
        owner,
        mint,
        poolKeys.id
      );
      console.log(accounts);
    } catch (e) {
      console.log(e);
    }
  }

  const onSwapToSolClick = async () => {
    try {
      const poolKeysList = await fetchAllPoolKeys();
      if (!poolKeysList) {
        throw Error("Some error occured in fetching pool keys.")
      }
      const [poolKeys,] = poolKeysList.filter(el => el.quoteMint === "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" &&
        el.baseMint === "So11111111111111111111111111111111111111112");

      const owner = window.solana.publicKey.toBase58();
      const mint = "6XSp58Mz6LAi91XKenjQfj9D1MxPEGYtgBkggzYvE8jY";

      const accounts = await swapToSol(
        connection,
        owner,
        mint,
        poolKeys.id
      );
      console.log(accounts);
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
      <button className='btn' onClick={onSwapFromSolClick}>Swap From Sol</button>
      <button className='btn' onClick={onSwapToSolClick}>Swap To Sol</button>
    </div>
  );
}


export default App;
