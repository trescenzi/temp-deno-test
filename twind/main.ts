import { getSheet, TwindConfig, setup } from "https://esm.sh/@twind/core@1.0.3"

export default function hydrate(options: TwindConfig) {
  setup(options, getSheet());
}
