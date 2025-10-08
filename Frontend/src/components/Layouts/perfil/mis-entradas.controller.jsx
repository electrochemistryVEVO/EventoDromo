"use client";

import React, { useEffect, useState } from "react";
import { getEntradas } from "../../../services/mis-entradas.service";
import MisEntradasView from "./mis-entradas"; // tu view actual (mis-entradas.jsx)

export default function MisEntradasController() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getEntradas()
      .then((data) => {
        if (!mounted) return;
        setEntries(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return <MisEntradasView entries={entries} loading={loading} error={error} />;
}