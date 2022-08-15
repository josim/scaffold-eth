import { TezosToolkit, MichelsonMap, OpKind } from "@taquito/taquito";
import { char2Bytes } from '@taquito/utils';
import { BeaconWallet } from "@taquito/beacon-wallet";
import config from "../contracts/tezos_contract";

//const preferredNetwork = "mainnet";
//const rpcURL = "https://nd-801-926-336.p2pify.com/dbd52b170d7e67e195a9db1403f17802"
const preferredNetwork = "jakartanet";
const rpcURL = "https://jakartanet.smartpy.io";
const options = {
  name: "drop_beta",
  iconUrl: "./ratata_logo_03.png",
  preferredNetwork: preferredNetwork,
};
const wallet = new BeaconWallet(options);


const getActiveAccount = async () => {
  return await wallet.client.getActiveAccount();
};

const connectWallet = async () => {
  let account = await wallet.client.getActiveAccount();

  if (!account) {
    await wallet.requestPermissions({
      network: { type: preferredNetwork },
    });
    account = await wallet.client.getActiveAccount();
  }
  return { success: true, wallet: account.address };
};

const disconnectWallet = async () => {
  await wallet.clearActiveAccount();
  await wallet.disconnect();
  return { success: true, wallet: null };
};

const checkIfWalletConnected = async (wallet) => {
  try {
    const activeAccount = await wallet.client.getActiveAccount();
    if (!activeAccount) {
      await wallet.client.requestPermissions({
        network: { type: preferredNetwork },
      });
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export const claim_token = async (leaf,proof,tezamount) => {
  console.log("claim_token");
  // const wallet = new BeaconWallet(options);
  const response = await checkIfWalletConnected(wallet);
  console.log(response);

  if (response.success) {
    let account = await wallet.client.getActiveAccount();
    const tezos = new TezosToolkit(rpcURL);
    const result = "";
    tezos.setProvider({ rpc: rpcURL });
    tezos.setWalletProvider(wallet);
    console.log(leaf);
    console.log(proof);
    await tezos.wallet
    .at(config.claimingContract)
    .then((contract) => {
      return contract.methods.claim(proof,leaf).send({ amount: tezamount });
    })
    .then((op) => {
      console.log(`Waiting for ${op.hash} to be confirmed...`);
      result = op.confirmation();
      return result.then(() => op.hash);
    })
    .then((hash) => {
      console.log(`Operation injected: https://jakarta.tzstats.com/${hash}`);
      result = hash;
    })
    .catch((error) => {
      console.log(`Error: ${JSON.stringify(error, null, 2)}`);
      console.log(error.message);
    });
    return result;

  }
};

export const getExpDate = async () => {
  const tezos = new TezosToolkit(rpcURL);
  const latestDate = await tezos.contract
  .at('KT1WXzAdaJzGsM9nWS68Zp42wMeosfoaREvE')
  .then((claimContract) => claimContract
    .storage()
    .then((claimStorage) => {
      console.log(`myStorage: ` + claimStorage['expiration_date']);
      return claimStorage['expiration_date'];
    })
    .then((expiration_date_value) => {

      console.log(`EXP DATE ${expiration_date_value}.`);
    }))
  .catch((error) => console.log(error.message))
  console.log("latestDate");
  console.log(latestDate);
  return latestDate;
};

export {
  connectWallet,
  disconnectWallet,
  getActiveAccount,
  checkIfWalletConnected,
};
