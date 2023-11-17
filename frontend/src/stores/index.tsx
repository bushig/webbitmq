import React from "react";
import StoreContext from "../contexts/StoreContext";
import RootStore from "./RootStore";

export const StoreProvider: React.VFC<{
    store: RootStore;
    children: React.ReactNode;
}> = ({
          children,
          store
      }) => (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    )