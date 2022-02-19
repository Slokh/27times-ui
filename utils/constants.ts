import { isBefore } from "date-fns";

export const CONTRACT_ADDRESS = "0x2121bc170a8ef73a5cf576bdf5d55f916d58b18b";

export const START_DATE = 1645160400 * 1000;
export const END_DATE = 1645246800 * 1000;
// export const END_DATE = (1645246800 - 30 * 60) * 1000;

export const EXTENSION_AMOUNT = 10; // minutes

export const isAuctionStarting = isBefore(Date.now(), START_DATE);
export const isAuctionEnding = isBefore(Date.now(), END_DATE);
