const API_BASE = "https://api.opensea.io";
const API_KEY = "281e8177c2694d9dbb1e4303599a82bf";

const CONTRACT_ADDRESS = "0xf0d2d631a24db247f5eb0421fa3e6a169c72565f";

const TOKEN_IDS = [296, 270, 264, 219, 243, 275, 253, 290, 276, 283];

const query = `?asset_contract_address=${CONTRACT_ADDRESS}&token_ids=${TOKEN_IDS.join(
  "&token_ids="
)}`;

const _fetch = async (endpoint: string) => {
  return await fetch(endpoint, {
    headers: {
      "X-API-KEY": API_KEY,
    },
  });
};

export const fetchItems = async () => {
  const response = await _fetch(`${API_BASE}/api/v1/assets${query}`);
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
