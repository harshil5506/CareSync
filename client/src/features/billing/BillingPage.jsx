import { useState, useEffect } from "react";
import { Plus, Search, Download, Eye, Trash2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import DataTable from "@/components/common/DataTable";
import EmptyState from "@/components/common/EmptyState";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { toast } from "sonner";

export function BillingPage() {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidAmount: 0,
    pendingAmount: 0,
    overdueAmount: 0,
  });

  const fetchBills = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...(searchQuery && { search: searchQuery }),
        ...(filterStatus !== "all" && { status: filterStatus }),
      };

      const response = await api.get("/billing", { params });
      setBills(response.data.bills);
      setPagination(response.data.pagination);

      // Calculate stats
      const paid = response.data.bills.reduce(
        (sum, bill) => sum + (bill.status === "paid" ? bill.totalAmount : 0),
        0
      );
      const pending = response.data.bills.reduce(
        (sum, bill) => sum + (bill.status === "pending" ? bill.totalAmount : 0),
        0
      );
      const overdue = response.data.bills.reduce(
        (sum, bill) => sum + (bill.status === "overdue" ? bill.totalAmount : 0),
        0
      );

      setStats({
        totalInvoices: response.data.pagination.total,
        paidAmount: paid,
        pendingAmount: pending,
        overdueAmount: overdue,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBills(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      try {
        await api.delete(`/billing/${id}`);
        toast.success("Bill deleted successfully");
        fetchBills();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete bill");
      }
    }
  };

  const statItems = [
    {
      label: "Total Invoices",
      value: stats.totalInvoices,
      color: "bg-blue-100 text-blue-800",
    },
    {
      label: "Paid",
      value: `₹${stats.paidAmount.toLocaleString("en-IN")}`,
      color: "bg-green-100 text-green-800",
    },
    {
      label: "Pending",
      value: `₹${stats.pendingAmount.toLocaleString("en-IN")}`,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      label: "Overdue",
      value: `₹${stats.overdueAmount.toLocaleString("en-IN")}`,
      color: "bg-red-100 text-red-800",
    },
  ];

  const columns = [
    {
      header: "Invoice ID",
      accessor: "billId",
    },
    {
      header: "Patient",
      accessor: (row) => row.patient?.user?.name || "N/A",
    },
    {
      header: "Amount",
      accessor: (row) => `₹${row.totalAmount.toLocaleString("en-IN")}`,
    },
    {
      header: "Paid",
      accessor: (row) => `₹${row.paidAmount.toLocaleString("en-IN")}`,
    },
    {
      header: "Status",
      accessor: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.status === "paid"
              ? "bg-green-100 text-green-800"
              : row.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : row.status === "partial"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/billing/${row._id}`)}
            className="text-blue-600 hover:text-blue-800"
            title="View"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Billing & Invoices
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage billing and payment records
          </p>
        </div>
        <button
          onClick={() => navigate("/billing/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus size={20} />
          New Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statItems.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-card rounded-lg shadow-md p-4"
          >
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-card rounded-lg shadow-md p-6">
        <form onSubmit={handleSearch} className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 border border-input rounded-lg">
              <Search size={20} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none bg-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                fetchBills(1);
              }}
              className="px-4 py-2 border border-input rounded-lg bg-background"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </form>

        {loading ? (
          <LoadingSkeleton count={5} />
        ) : bills.length === 0 ? (
          <EmptyState
            title="No invoices found"
            description="Start by creating a new invoice"
            icon="💳"
          />
        ) : (
          <>
            <DataTable columns={columns} data={bills} />
            {pagination.pages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => fetchBills(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-input rounded hover:bg-muted disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => fetchBills(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-input rounded hover:bg-muted disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BillingPage;
