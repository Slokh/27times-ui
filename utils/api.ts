import { Network, OpenSeaPort } from "opensea-js";
import { WyvernSchemaName } from "opensea-js/lib/types";
import { CONTRACT_ADDRESS } from "./constants";

const API_BASE = "https://api.opensea.io";
const API_KEY = "281e8177c2694d9dbb1e4303599a82bf";

const query = `?asset_contract_address=${CONTRACT_ADDRESS}`;

const TEST_CONTRACT_ADDRESS = "0x495f947276749ce646f68ac8c248420045cb7b5e";
const TEST_TOKEN_ID =
  "23163376450661353913759955999481409998945686505485717428581112702764471812097";

const _fetch = async (endpoint: string) => {
  return await fetch(endpoint, {
    headers: {
      "X-API-KEY": API_KEY,
    },
  });
};

export const fetchItems = async () => {
  const response = await _fetch(`${API_BASE}/api/v1/assets${query}&limit=50`);
  if (response.status != 200) {
    return [];
  }

  const data = await response.json();
  return data.assets;
};

export const fetchItem = async (tokenId: string) => {
  const response = await _fetch(
    `${API_BASE}/api/v1/assets?asset_contract_address=${CONTRACT_ADDRESS}&token_ids=${tokenId}`
  );
  if (response.status != 200) {
    return {};
  }

  const data = await response.json();
  return data?.assets?.length ? data.assets[0] : {};
};

export const fetchItemBids = async (tokenId: string) => {
  // const response = await _fetch(
  //   `${API_BASE}/wyvern/v1/orders?asset_contract_address=${CONTRACT_ADDRESS}&token_id=${tokenId}&side=0&order_by=eth_price&order_direction=desc`
  // );
  const response = await _fetch(
    `${API_BASE}/wyvern/v1/orders?asset_contract_address=${TEST_CONTRACT_ADDRESS}&token_id=${TEST_TOKEN_ID}&side=0&order_by=eth_price&order_direction=desc`
  );
  if (response.status != 200) {
    return [];
  }

  const data = await response.json();
  return data.orders;
};

export const fetchTopBids = async () => {
  const response = await _fetch(
    `${API_BASE}/wyvern/v1/orders${query}&side=0&order_by=eth_price&order_direction=desc`
  );
  if (response.status != 200) {
    return [];
  }

  const data = await response.json();
  return data.orders;
};

export const makeBid = async (
  provider: any,
  address: string | null | undefined,
  tokenId: string,
  amount: number
) => {
  if (!address) {
    return "Error connecting to wallet";
  }

  const seaport = new OpenSeaPort(provider, {
    networkName: Network.Main,
    apiKey: API_KEY,
  });

  console.log({
    asset: {
      tokenId: TEST_TOKEN_ID,
      tokenAddress: TEST_CONTRACT_ADDRESS,
      schemaName: WyvernSchemaName.ERC1155,
    },
    accountAddress: address,
    startAmount: amount,
  });

  try {
    await seaport.createBuyOrder({
      asset: {
        tokenId: TEST_TOKEN_ID,
        tokenAddress: TEST_CONTRACT_ADDRESS,
        schemaName: WyvernSchemaName.ERC1155,
      },
      accountAddress: address,
      startAmount: amount,
      expirationTime: Math.round(Date.now() / 1000 + 60 * 60 * 24),
    });
  } catch (e: any) {
    return e.message;
  }

  return null;
};
