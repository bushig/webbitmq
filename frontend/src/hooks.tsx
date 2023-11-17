import {useContext} from "react"
import RootStore from "./stores/RootStore"
import StoreContext from "./contexts/StoreContext"

export const useStores = (): RootStore => useContext(StoreContext)

