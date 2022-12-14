import { JSX, options as preactOptions, VNode } from "preact";
import { setup as twindSetup, TwindConfig, Sheet, tw, virtual, stringify } from "https://esm.sh/@twind/core@1.0.3";
import { Plugin } from "$fresh/server.ts";

export const STYLE_ELEMENT_ID = "__FRSH_TWIND";

export interface Options extends TwindConfig {
  selfURL: string;
}

declare module "preact" {
  namespace JSX {
    interface DOMAttributes<Target extends EventTarget> {
      class?: string;
      className?: string;
    }
  }
}

export function setup({selfURL, ...config}: Options, sheet: Sheet) {
  twindSetup(config, sheet);

  const originalHook = preactOptions.vnode;
  // deno-lint-ignore no-explicit-any
  preactOptions.vnode = (vnode: VNode<JSX.DOMAttributes<any>>) => {
    if (typeof vnode.type === "string" && typeof vnode.props === "object") {
      const { props } = vnode;
      const classes: string[] = [];
      if (props.class) {
        classes.push(tw(props.class));
        props.class = undefined;
      }
      if (props.className) {
        classes.push(tw(props.className));
      }
      if (classes.length) {
        props.class = classes.join(" ");
      }
    }

    originalHook?.(vnode);
  };
}

export function plugin(options: Options): Plugin {
  const sheet = virtual();
  setup(options, sheet);
  const main = `data:application/javascript,import hydrate from "${
    new URL("./twind/main.ts", import.meta.url).href
  }";
import options from "${options.selfURL}";
export default function(state) { hydrate(options, state); }`;
  return {
    name: "twind",
    entrypoints: { "main": main },
    render(ctx) {
      const res = ctx.render();
      const  cssText = stringify(sheet.target);
      const scripts = [];
      if (res.requiresHydration) scripts.push({ entrypoint: "main", state: [] });
      return {
        scripts,
        styles: [{ cssText, id: STYLE_ELEMENT_ID }],
      };
    },
  };
}
