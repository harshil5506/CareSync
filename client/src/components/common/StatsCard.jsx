export function StatsCard({ icon: Icon, label, value, trend, trendPositive }) {
  return (
    <div className="bg-white dark:bg-card p-6 rounded-lg shadow-md border border-border hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">{value}</h3>
          {trend && (
            <p
              className={`text-xs font-semibold mt-2 ${
                trendPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trendPositive ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon size={24} className="text-primary" />
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
