import React, { createContext } from "react";
import RootStore from "../stores/RootStore";

const StoreContext = createContext<RootStore>({} as RootStore);

export default StoreContext