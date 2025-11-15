import React from 'react';

export default function TableResponse({data}) {
  if (!Array.isArray(data) || data.length === 0) return <div>No structured data.</div>;
  const headers = Object.keys(data[0]);
  return (
    <div className="overflow-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {headers.map(h => <th key={h} className="text-left px-2 py-1 border-b dark:text-white">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="odd:bg-gray-50 dark:odd:bg-gray-700">
              {headers.map(h => <td key={h} className="px-2 py-1 dark:text-white">{String(row[h])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}