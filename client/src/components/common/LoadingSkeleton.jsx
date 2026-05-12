export function LoadingSkeleton({ count = 3, type = "card" }) {
  if (type === "card") {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-card p-6 rounded-lg shadow-md"
          >
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
              <div className="h-8 bg-muted rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 p-4 bg-white dark:bg-card rounded-lg"
          >
            <div className="h-10 w-10 bg-muted rounded animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default LoadingSkeleton;
