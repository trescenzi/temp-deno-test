import { dom, TwindConfig, setup } from "https://esm.sh/@twind/core@1.0.3"
import { STYLE_ELEMENT_ID } from "@/twindPlugin.ts";

export default function hydrate(options: TwindConfig) {
  const el = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement;
  const sheet = dom(el);
  setup(options, sheet);
}
