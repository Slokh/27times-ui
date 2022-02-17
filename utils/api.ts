import { CONTRACT_ADDRESS } from "./constants";

const API_BASE = "https://api.opensea.io";
const API_KEY = "281e8177c2694d9dbb1e4303599a82bf";

const query = `?asset_contract_address=${CONTRACT_ADDRESS}`;

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
  const response = await _fetch(
    `${API_BASE}/wyvern/v1/orders?asset_contract_address=${CONTRACT_ADDRESS}&token_id=${tokenId}&side=0&order_by=eth_price&order_direction=desc`
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
