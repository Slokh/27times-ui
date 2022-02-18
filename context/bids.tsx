import { fetchBids } from "@27times/utils/api";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type State = {
  bids: any;
  getBidsForId: any;
};

type BidsContextType = State | undefined;
type BidsProviderProps = { basePath?: string; children: ReactNode };

const BidsContext = createContext<BidsContextType>(undefined);

export const BidsProvider = ({ children }: BidsProviderProps) => {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    (async () => setBids(await fetchBids()))();
  }, []);

  // const getBidsForId = (id: any) =>
  //   bids
  //     .filter(({ asset }: any) => asset.token_id === id)
  //     .sort((a: any, b: any) => b.bid_amount - a.bid_amount);

  const getBidsForId = (id: any) =>
    bids
      .filter(
        ({ asset }: any) =>
          asset.token_id ===
          "23163376450661353913759955999481409998945686505485717428581112706063006695425"
      )
      .sort((a: any, b: any) => b.bid_amount - a.bid_amount);

  return (
    <BidsContext.Provider value={{ bids, getBidsForId }}>
      {children}
    </BidsContext.Provider>
  );
};

export const useBids = () => {
  const context = useContext(BidsContext);

  if (context === undefined) {
    throw new Error("useBids must be used within a BidsProvider");
  }

  return context;
};
