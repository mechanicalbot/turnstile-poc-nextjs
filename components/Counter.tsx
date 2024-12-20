"use client";

import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef, useState, useEffect } from "react";
import { getCount$, increment$ } from "./actions";

export function WrapperApp() {
  const [visible, setVisible] = useState(true);

  return (
    <div>
      <button onClick={() => setVisible((x) => !x)}>
        {visible ? "Hide" : "Show"}
      </button>
      {visible && <Counter />}
    </div>
  );
}

const cfKeys = {
  env: process.env.NEXT_PUBLIC_CF_SITE_KEY!,
  passesVisible: "1x00000000000000000000AA",
  blocksVisible: "2x00000000000000000000AB",
  passesInvisible: "1x00000000000000000000BB",
  blocksInvisible: "2x00000000000000000000BB",
  forceInteractiveVisible: "3x00000000000000000000FF",
};

function Counter({}) {
  const turnstileRef = useRef<TurnstileInstance>();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const body = await getCount$();
        setCount(body.count);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const increment = async () => {
    setLoading(true);
    try {
      const turnstile = await turnstileRef.current?.getResponsePromise();
      const body = await increment$({ turnstile: turnstile });
      setCount(body.count);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button disabled={loading} onClick={increment}>
        Count: {count}
      </button>
      <Turnstile
        ref={(ref) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          turnstileRef.current = ref as any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).turnstileRef = ref;
        }}
        siteKey={cfKeys.env}
        // siteKey={cfKeys.passesVisible}
        // siteKey={cfKeys.blocksVisible}
        // siteKey={cfKeys.passesInvisible}
        // siteKey={cfKeys.blocksInvisible}
        // siteKey={cfKeys.forceInteractiveVisible}
      />
    </div>
  );
}
