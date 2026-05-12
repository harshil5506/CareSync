import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export function DataTable({
  columns,
  data,
  onRowClick,
  isLoading = false,
  pagination = null,
}) {
  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortedData = () => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedData = getSortedData();

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">Loading...</div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-card rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort(column.key)}
                    className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition"
                  >
                    {column.label}
                    {sortConfig?.key === column.key &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className="border-b border-border hover:bg-muted transition cursor-pointer"
              >
                {columns.map((column) => (
                  <td key={`${rowIndex}-${column.key}`} className="px-6 py-4">
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {pagination.from} to {pagination.to} of {pagination.total}
          </div>
          <div className="flex gap-2">
            <button
              onClick={pagination.onPrevious}
              disabled={!pagination.hasPrevious}
              className="px-3 py-2 border border-input rounded-lg hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Previous
            </button>
            <button
              onClick={pagination.onNext}
              disabled={!pagination.hasNext}
              className="px-3 py-2 border border-input rounded-lg hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
