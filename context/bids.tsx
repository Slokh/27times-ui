import { fetchBids } from "@27times/utils/api";
import { allPoems } from "@27times/utils/metadata";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type State = {
  poems: any;
};

type PoemsContextType = State | undefined;
type PoemsProviderProps = { basePath?: string; children: ReactNode };

const PoemsContext = createContext<PoemsContextType>(undefined);

export const PoemsProvider = ({ children }: PoemsProviderProps) => {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    (async () => setBids(await fetchBids()))();
  }, []);

  const getBidsForId = (id: any) =>
    bids
      .filter(({ asset }: any) => asset.token_id === id)
      .sort((a: any, b: any) => b.bid_amount - a.bid_amount);

  return (
    <PoemsContext.Provider
      value={{
        poems: allPoems
          .map((poem) => {
            const bids: any = getBidsForId(poem.id);

            return {
              ...poem,
              bids,
              highestBid: bids?.length ? bids[0].bid_amount / 1e18 : 0,
            };
          })
          .sort((a: any, b: any) => b.highestBid - a.highestBid),
      }}
    >
      {children}
    </PoemsContext.Provider>
  );
};

export const usePoems = () => {
  const context = useContext(PoemsContext);

  if (context === undefined) {
    throw new Error("usePoems must be used within a PoemsProvider");
  }

  return context;
};

export const usePoem = (id: any) => {
  const { poems } = usePoems();

  return { poem: poems.find((poem: any) => poem.id === id) };
};
