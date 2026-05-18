import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import SearchFilter from "@/components/common/SearchFilter";
import DataTable from "@/components/common/DataTable";
import EmptyState from "@/components/common/EmptyState";

export function DepartmentsListPage() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useState({ query: "", filters: {} });

  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ];

  const fetchDepartments = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search: searchParams.query || undefined,
        ...searchParams.filters,
      };

      const response = await api.get("/departments", { params });
      setDepartments(response.data.data.departments);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments(1);
  }, [searchParams]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;

    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments(1);
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-sm font-medium ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  const columns = [
    { key: "name", label: "Department Name" },
    { key: "description", label: "Description" },
    {
      key: "head",
      label: "Head",
      render: (value) => value?.name || "Not assigned",
    },
    {
      key: "doctors",
      label: "Doctors",
      render: (value) => value?.length || 0,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => getStatusBadge(value),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/departments/${row._id}`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => navigate(`/departments/${row._id}/edit`)}
            className="p-2 text-green-600 hover:bg-green-50 rounded"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Departments</h1>
        <button
          onClick={() => navigate("/departments/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus size={20} />
          Add Department
        </button>
      </div>

      <SearchFilter
        onSearch={setSearchParams}
        placeholder="Search departments..."
        filters={filters}
      />

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : departments.length === 0 ? (
        <EmptyState
          title="No Departments Found"
          description="There are no departments yet. Create your first department to get started."
          action={{ label: "Add Department" }}
        />
      ) : (
        <>
          <DataTable columns={columns} data={departments} />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">
              Showing {departments.length} of {pagination.total} departments
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => fetchDepartments(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => fetchDepartments(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DepartmentsListPage;
