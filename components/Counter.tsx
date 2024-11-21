"use client";

import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef, useState, useEffect } from "react";
import { getCount$, increment$ } from "./actions";

export function WrapperApp() {
  const [visible, setVisible] = useState(false);

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
        ref={turnstileRef}
        options={{}}
        siteKey={cfKeys.passesVisible}
        // siteKey={cfKeys.blocksVisible}
        // siteKey={cfKeys.passesInvisible}
        // siteKey={cfKeys.blocksInvisible}
        // siteKey={cfKeys.forceInteractiveVisible}
      />
    </div>
  );
}
