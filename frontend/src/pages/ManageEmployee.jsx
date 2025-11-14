import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const ManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const token = localStorage.getItem("token");

  // Fetch employees
  useEffect(() => {
    fetchEmployees(pagination.currentPage);
  }, [pagination.currentPage]);

  const fetchEmployees = async (page = 1) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/employee/get-employee?page=${page}&limit=${pagination.perPage}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployees(res.data.users || []);
      setPagination({
        currentPage: res.data.pagination.currentPage,
        totalPages: res.data.pagination.totalPages,
        perPage: res.data.pagination.perPage,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching employees");
    }
  };

  // Open/close modal
  const openModal = (emp = null) => {
    if (emp) {
      setEditId(emp._id);
      setFormData({ name: emp.name, email: emp.email, password: "", role: emp.role });
    } else {
      setEditId(null);
      setFormData({ name: "", email: "", password: "", role: "employee" });
    }
    setErrorMsg("");
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setErrorMsg("");
  };

  // Form change & submit
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editId && formData.password.trim().length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    try {
      let res;
      if (editId) {
        res = await axios.put(
          `http://localhost:3000/api/employee/update-employee/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        res = await axios.post(
          "http://localhost:3000/api/employee/create-employee",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      toast.success(res.data.message);
      setFormData({ name: "", email: "", password: "", role: "employee" });
      setEditId(null);
      setIsModalOpen(false);
      fetchEmployees(pagination.currentPage);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving employee");
    }
  };

  // Soft delete / restore / permanent delete
  const handleSoftDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.patch(`http://localhost:3000/api/employee/soft-delete/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Employee deleted successfully");
      fetchEmployees(pagination.currentPage);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting employee");
    }
  };
  const handleRestore = async (id) => {
    if (!window.confirm("Are you sure you want to restore this employee?")) return;
    try {
      await axios.patch(`http://localhost:3000/api/employee/restore/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Employee restored successfully");
      fetchEmployees(pagination.currentPage);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error restoring employee");
    }
  };
  const handlePermanentDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this employee?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/employee/permanent-delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Employee permanently deleted successfully");
      fetchEmployees(pagination.currentPage);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error permanently deleting employee");
    }
  };

  // Pagination logic: show max 5 pages
  const getPageNumbers = () => {
    const total = pagination.totalPages;
    const current = pagination.currentPage;
    let start = Math.max(current - 2, 1);
    let end = Math.min(start + 4, total);
    start = Math.max(end - 4, 1);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Employees</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No employees found</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => (
                  <tr
                    key={emp._id}
                    className={`border-b ${emp.isDeleted ? "bg-gray-100 italic text-gray-500" : "hover:bg-gray-50"}`}
                  >
                    <td className="p-3">{(pagination.currentPage - 1) * pagination.perPage + index + 1}</td>
                    <td className="p-3">{emp.name}</td>
                    <td className="p-3">{emp.email}</td>
                    <td className="p-3 capitalize">{emp.role}</td>
                    <td className="p-3">{emp.isDeleted ? "Deleted" : "Active"}</td>
                    <td className="p-3 flex justify-center gap-2 flex-wrap">
                      {!emp.isDeleted ? (
                        <>
                          <button onClick={() => openModal(emp)} className="text-blue-600 hover:underline">Edit</button>
                          <button onClick={() => handleSoftDelete(emp._id)} className="text-red-600 hover:underline">Delete</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleRestore(emp._id)} className="text-green-600 hover:underline">Restore</button>
                          <button onClick={() => handlePermanentDelete(emp._id)} className="text-red-800 hover:underline">Permanent Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-5 gap-2 overflow-x-auto">
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(prev.currentPage - 1, 1) }))}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>

            {getPageNumbers().map(i => (
              <button
                key={i}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: i }))}
                className={`px-3 py-1 rounded ${pagination.currentPage === i ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                {i}
              </button>
            ))}

            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(prev.currentPage + 1, pagination.totalPages) }))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">{editId ? "Edit Employee" : "Add Employee"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input type="text" name="name" placeholder="Employee Name" value={formData.name} onChange={handleChange} className="border p-2 rounded" required />
              <input type="email" name="email" placeholder="Employee Email" value={formData.email} onChange={handleChange} className="border p-2 rounded" required />
              {!editId && (
                <>
                  <input type="password" name="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={handleChange} className="border p-2 rounded" required />
                  {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
                </>
              )}
              <input name="role" placeholder="Role" value={formData.role} onChange={handleChange} className="border p-2 rounded" readOnly />
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{editId ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEmployee;
