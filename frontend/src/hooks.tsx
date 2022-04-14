import {useContext} from "react"
import RootStore from "./stores/RootStore"
import StoreContext from "./contexts/StoreContext"

// eslint-disable-next-line import/prefer-default-export
export const useStores = (): RootStore => useContext(StoreContext)

