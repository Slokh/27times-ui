import { Network, OpenSeaPort } from "opensea-js";
import { WyvernSchemaName } from "opensea-js/lib/types";
import { CONTRACT_ADDRESS } from "./constants";

const API_BASE = "https://api.opensea.io";
const API_KEY = "281e8177c2694d9dbb1e4303599a82bf";

const COLLECTION = "27-times-by-karsen-daily";

const _fetch = async (endpoint: string) => {
  return await fetch(endpoint, {
    headers: {
      "X-API-KEY": API_KEY,
    },
  });
};

export const fetchBids = async () => {
  let response = await _fetch(
    `${API_BASE}/api/v1/events?collection_slug=${COLLECTION}&event_type=offer_entered&only_opensea=true`
  );
  if (response.status != 200) {
    return [];
  }

  let data = await response.json();
  let bids = data.asset_events;

  while (data.next) {
    response = await _fetch(
      data.next
        .replace("http://api-web1", "https://api")
        .replace("http://api-web2", "https://api")
    );
    data = await response.json();
    bids = bids.concat(data.asset_events);
  }

  return bids;
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

  try {
    await seaport.createBuyOrder({
      asset: {
        tokenId: tokenId,
        tokenAddress: CONTRACT_ADDRESS,
        schemaName: WyvernSchemaName.ERC721,
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
