import { BarChart3, TrendingUp, Users, Calendar, PieChart } from "lucide-react";

export function AnalyticsPage() {
  const stats = [
    { icon: Users, label: "Total Patients", value: "1,250", trend: "+12%" },
    { icon: Calendar, label: "Total Appointments", value: "856", trend: "+8%" },
    {
      icon: TrendingUp,
      label: "Revenue This Month",
      value: "₹2,45,000",
      trend: "+15%",
    },
    { icon: BarChart3, label: "Avg Rating", value: "4.8/5", trend: "+0.2" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          View comprehensive insights and metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-card rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <Icon className="text-primary" size={24} />
                <span className="text-green-600 text-sm font-medium">
                  {stat.trend}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Appointments Trend
          </h2>
          <div className="h-40 flex items-center justify-center border border-dashed border-border rounded">
            <div className="text-center">
              <BarChart3
                size={40}
                className="mx-auto text-muted-foreground mb-2"
              />
              <p className="text-muted-foreground text-sm">
                Chart rendering coming soon
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Department Distribution
          </h2>
          <div className="h-40 flex items-center justify-center border border-dashed border-border rounded">
            <div className="text-center">
              <PieChart
                size={40}
                className="mx-auto text-muted-foreground mb-2"
              />
              <p className="text-muted-foreground text-sm">
                Chart rendering coming soon
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-card rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Recent Appointments
        </h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center p-3 border border-border rounded hover:bg-muted transition"
            >
              <div>
                <p className="font-medium text-foreground">Patient {i}</p>
                <p className="text-sm text-muted-foreground">
                  Dr. Name • 2 days ago
                </p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                Completed
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
        <p className="text-sm text-orange-800 dark:text-orange-200">
          📊 <strong>Analytics Module:</strong> Advanced analytics with Recharts
          integration, real-time metrics, and department-wise analytics coming
          in Phase 7.
        </p>
      </div>
    </div>
  );
}

export default AnalyticsPage;
