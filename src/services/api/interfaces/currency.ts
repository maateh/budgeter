// types
import { Currencies } from "@/services/api/types"

interface ICurrencyAPI {
  get(): Promise<Currencies>
}

export default ICurrencyAPI
