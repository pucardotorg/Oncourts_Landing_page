import React from "react";

interface TableRowCardProps {
  data: Record<string, string | JSX.Element>; // supports string or JSX
  t: (key: string) => string;
}

const TableRowCard: React.FC<TableRowCardProps> = ({ data, t }) => {
  const entries = Object.entries(data);

  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 mb-3 shadow-sm w-full text-sm text-slate-700">
      {/* Serial number on top */}
      {entries.map(([key, value]) =>
        key === "Sl. No" ? (
          <div
            key={key}
            className="text-base font-bold text-slate-800 mb-3 border-b"
          >
            {value}
          </div>
        ) : null
      )}

      {/* All other key-value pairs */}
      {entries
        .filter(([key]) => key !== "Sl. No")
        .map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between py-1 border-b last:border-none"
          >
            <span className="font-bold text-slate-500">{t(key)}</span>
            <span className="text-slate-700 text-right max-w-[55%] break-words">
              {typeof value === "string" ? t(value) : value}
            </span>
          </div>
        ))}
    </div>
  );
};

export default TableRowCard;
