"use client";

import { useState, useEffect } from "react";
import { StockRecord } from "./types";

export function usePortfolio() {
  const [records, setRecords] = useState<StockRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem("portfolio_records");
      if (saved) {
        try {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setRecords(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse portfolio records", e);
        }
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecords([]);
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoaded(true);
    };

    load();
    window.addEventListener("portfolio_update", load);
    return () => window.removeEventListener("portfolio_update", load);
  }, []);

  const addRecord = (record: StockRecord) => {
    const updated = [record, ...records];
    setRecords(updated);
    localStorage.setItem("portfolio_records", JSON.stringify(updated));
    window.dispatchEvent(new Event("portfolio_update"));
  };

  const removeRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    localStorage.setItem("portfolio_records", JSON.stringify(updated));
    window.dispatchEvent(new Event("portfolio_update"));
  };

  return { records, addRecord, removeRecord, isLoaded };
}

export function useApiKey() {
  const [apiKey, setApiKey] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem("gemini_api_key");
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setApiKey(saved);
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoaded(true);
    };

    load();
    window.addEventListener("apikey_update", load);
    return () => window.removeEventListener("apikey_update", load);
  }, []);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("gemini_api_key", key);
    window.dispatchEvent(new Event("apikey_update"));
  };

  return { apiKey, saveApiKey, isLoaded };
}
