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
  findDcaDerivedAddress,
  findAssociatedTokenAddress,
  NativeMint,
} from "./dca-program";

const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const USDT_MINT = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";

function App() {
  const onDepositTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = USDC_MINT;
      const amount = 0.001;

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
      const mint = USDC_MINT;
      const amount = 0.001;

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
      const mint = USDC_MINT;
      const dcaData = "uizRumTX5pnUKf6W5syhAfPJAc9Z3j4VcedVgTn8ZWu";
      const startTime = Math.floor(Date.now() / 1000) + (0.5 * 60); // add 0.5 min
      console.log(startTime.toString(), new Date(startTime * 1000).toLocaleDateString())
      const dcaAmount = 0.001;
      const dcaTime = 30 * 60  // 30 min

      const minimumAmountOut = 1.5;

      const { status, data } = await initialize(
        connection,
        owner,
        mint,
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
      console.log(e.logs)
    }
  }


  const onWithdrawTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const dcaData = "3xqr93XohjuYTqq6xvzjYWn8ZJe6e1omU6KUF8Jre7Eu";
      const mint = USDC_MINT;
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
      const mint = USDC_MINT;
      const dcaData = "B4mAeTp58jJuoXsLqQnhuytj67TpGQnzqoJDg9FMyzRy";
      const transferAmount = 0.5;

      const { status, data } = await withdrawSol(
        connection,
        owner,
        mint,
        dcaData,
        transferAmount
      );

      console.log(status);
      console.log(data);

    } catch (e) {
      console.log(e.logs ? e.logs : e);
    }
  }

  const onFundTokenClick = async () => {
    try {
      const owner = window.solana.publicKey.toBase58();
      const mint = USDC_MINT;
      const dcaData = "B4mAeTp58jJuoXsLqQnhuytj67TpGQnzqoJDg9FMyzRy";
      const transferAmount = 0.001;

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
      const dcaData = "uizRumTX5pnUKf6W5syhAfPJAc9Z3j4VcedVgTn8ZWu";
      const mint = USDC_MINT;
      const transferAmount = 0.001;

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
      const mint = USDC_MINT;
      const dcaData = "uizRumTX5pnUKf6W5syhAfPJAc9Z3j4VcedVgTn8ZWu";
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
      const mint = USDC_MINT;
      const dcaData = "B4mAeTp58jJuoXsLqQnhuytj67TpGQnzqoJDg9FMyzRy";
      const { status, data } = await swapToSol(
        connection,
        owner,
        mint,
        dcaData
      );
      console.log(status);
      console.log(data.signature);
    } catch (e) {
      console.log(e.logs ? e.logs : e);
    }
  }

  const onDcaDataClick = async () => {
    try {
      const dcaDataAddress = "uizRumTX5pnUKf6W5syhAfPJAc9Z3j4VcedVgTn8ZWu";
      let dcaAccount = await connection.getAccountInfo(new PublicKey(dcaDataAddress), "confirmed");
      let dcaData = DcaAccount.decodeUnchecked(dcaAccount.data)
      console.log("Dca Account Data",
        `total amount: ${dcaData.totalAmount.toString()},
        sender: ${new PublicKey(dcaData.senderAccount).toString()},
        mint: ${new PublicKey(dcaData.mintAddress).toString()},
        start time: ${new Date(dcaData.startTime * 1000).toLocaleString()},
        dca amount: ${dcaData.dcaAmount.toString()},
        dca time: ${dcaData.dcaTime.toString()},
        flag: ${dcaData.flag.toString()},
        state: ${dcaData.state.toString()},
        minimumAmountOut: ${dcaData.minimumAmountOut.toString()}`,
      );
    } catch (e) {
      console.log("error: ", e);
    }
  }

  const onGetWithdrawableTokenBalanceClicked = async () => {
    try {
      const owner = window.solana.publicKey;
      const mint = new PublicKey(USDC_MINT);
      const dcaDataAddress = new PublicKey("uizRumTX5pnUKf6W5syhAfPJAc9Z3j4VcedVgTn8ZWu");
      const [vault,] = await findDcaDerivedAddress([owner.toBuffer(), dcaDataAddress.toBuffer()]);
      console.log("vault", vault.toString());

      const [vaultAToken,] = await findAssociatedTokenAddress(vault, mint);
      console.log("vaultAToken", vaultAToken.toString());

      const [nmVaultAToken,] = await findAssociatedTokenAddress(vault, NativeMint);
      console.log("nmVaultAToken", nmVaultAToken.toString())

      const mintBal = await connection.getTokenAccountBalance(vaultAToken, "finalized");
      console.log(`Non native mint balance of ${vault}: ${mintBal.value.amount}`);

      const nativeMintBal = await connection.getTokenAccountBalance(nmVaultAToken, "finalized");
      console.log(`Native mint balance balance of ${vault}: ${nativeMintBal.value.amount}`);
    } catch (e) {
      console.log(e);
    }
  }


  return (
    <div className="App">
      {/* <Icon mint={"zebeczgi5fSEtbpfQKVZKCJ3WgYXxjkMUkNNx7fLKAF"} />
      <Icon mint={"666YXKdQzN49gzQetYffQUhy4hLxEB31PZkRew4VrXAj"} />
      <Icon mint={"G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB"} />
      <Icon mint={"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"} />
      <Icon mint={"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"} />
      <Icon mint={"7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT"} />
      <Icon mint={"7ScYHk4VDgSRnQngAUtQk4Eyf7fGat8P4wXq6e2dkzLj"} />
      <Icon mint={"FMJotGUW16AzexRD3vXJQ94AL71cwrhtFaCTGtK1QHXm"} />
      <Icon mint={"SCYfrGCw8aDiqdgcpdGjV6jp4UVVQLuphxTDLNWu36f"} />
      <Icon mint={"4CHXd5uSMb9qrLfQwvyHzDMiKmNKDP8Np23dAQWTKNEy"} />
      <Icon mint={"H5cDniBsyfoddtHrfz6gCSw7R23ZwRuzozD4Fek9WUsS"} />
      <Icon mint={"So11111111111111111111111111111111111111112"} />
      <br></br> */}
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
      <button className='btn' onClick={onGetWithdrawableTokenBalanceClicked}>Get Token Balance</button>
    </div>
  );
}


export default App;
