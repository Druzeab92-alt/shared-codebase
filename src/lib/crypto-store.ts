import { useEffect, useState } from "react";
import { initialAddresses, type CryptoAddress } from "./crypto-data";

const KEY = "ww-crypto-addresses";

export function useCryptoAddresses() {
  const [list, setList] = useState<CryptoAddress[]>(initialAddresses);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setList(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(list));
  }, [list, ready]);
  const togglePin = (id: string) => setList((l) => l.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a)));
  return { addresses: list, togglePin };
}
