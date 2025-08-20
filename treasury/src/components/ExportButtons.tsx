"use client";
import { useState } from 'react';

export function ExportButtons({ endpoint, params }: { endpoint: string; params?: Record<string, string>; }) {
  const [loading, setLoading] = useState(false);
  const q = params ? '?' + new URLSearchParams(params).toString() : '';
  return (
    <div className="flex gap-2">
      <button className="btn" disabled={loading} onClick={async () => {
        setLoading(true);
        const res = await fetch(`${endpoint}/excel${q}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'export.xlsx'; a.click();
        setLoading(false);
      }}>تصدير Excel</button>
      <button className="btn-outline" disabled={loading} onClick={async () => {
        setLoading(true);
        const res = await fetch(`${endpoint}/pdf${q}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'export.pdf'; a.click();
        setLoading(false);
      }}>طباعة PDF</button>
    </div>
  );
}

