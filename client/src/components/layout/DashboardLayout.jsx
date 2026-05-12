import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

export function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background dark:bg-slate-950">
      <Sidebar />
      <TopNavbar />

      {/* Main Content */}
      <main className="lg:ml-64 mt-20 p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;
