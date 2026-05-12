import { useState } from "react";
import { Search, X } from "lucide-react";

export function SearchFilter({ onSearch, placeholder = "Search...", filters }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState({});

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ query: searchQuery, filters: filterValues });
  };

  const handleClear = () => {
    setSearchQuery("");
    setFilterValues({});
    onSearch({ query: "", filters: {} });
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filterValues, [filterKey]: value };
    setFilterValues(newFilters);
    onSearch({ query: searchQuery, filters: newFilters });
  };

  return (
    <div className="bg-white dark:bg-card rounded-lg shadow-md p-4 mb-6 space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-3 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
        >
          Search
        </button>
        {(searchQuery || Object.keys(filterValues).length > 0) && (
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition flex items-center gap-2"
          >
            <X size={16} />
            Clear
          </button>
        )}
      </form>

      {/* Filters */}
      {filters && filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <select
              key={filter.key}
              value={filterValues[filter.key] || ""}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              className="px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchFilter;
