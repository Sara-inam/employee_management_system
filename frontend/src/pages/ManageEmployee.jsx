<<<<<<< HEAD
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {EMP_API} from '../config.js';


const token = localStorage.getItem("token");

const axiosAuth = axios.create({
  headers: { Authorization: `Bearer ${token}` },
});

const validateEmail = (email) => {
  // Check if it's a valid email and ends with @gmail.com
  const re = /^[^\s@]+@gmail\.com$/;
  return re.test(email);
};

const ManageEmployee = () => {
  const queryClient = useQueryClient();

=======
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const ManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
  });
<<<<<<< HEAD

=======
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });
<<<<<<< HEAD

  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

 
  // FETCH EMPLOYEES (TanStack Query)

  const { data, isLoading } = useQuery({
    queryKey: ["employees", pagination.currentPage],
    queryFn: async () => {
      const res = await axiosAuth.get(
        `${EMP_API}/get-employee?page=${pagination.currentPage}&limit=${pagination.perPage}`
      );

=======
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
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
      setPagination({
        currentPage: res.data.pagination.currentPage,
        totalPages: res.data.pagination.totalPages,
        perPage: res.data.pagination.perPage,
      });
<<<<<<< HEAD

      return res.data.users || [];
    },
    keepPreviousData: true,
  });

  const employees = data || [];

  
  // CREATE EMPLOYEE (use mutation)

  const createMutation = useMutation({
    mutationFn: (body) => axiosAuth.post(`${EMP_API}/create-employee`, body),
    onSuccess: () => {
      toast.success("Employee created");
      queryClient.invalidateQueries(["employees"]);
    },
    onError: (error) => toast.error(error.response?.data?.message || "Error"),
  });

  
  // UPDATE EMPLOYEE (use mutation)
 
  const updateMutation = useMutation({
    mutationFn: ({ id, body }) =>
      axiosAuth.put(`${EMP_API}/update-employee/${id}`, body),
    onSuccess: () => {
      toast.success("Employee updated");
      queryClient.invalidateQueries(["employees"]);
    },
    onError: (error) => toast.error(error.response?.data?.message || "Error"),
  });

  
  // SOFT DELETE(use mutation)
 
  const softDeleteMutation = useMutation({
    mutationFn: (id) => axiosAuth.patch(`${EMP_API}/soft-delete/${id}`),
    onSuccess: () => {
      toast.success("Employee deleted");
      queryClient.invalidateQueries(["employees"]);
    },
  });

  // RESTORE (use mutation)
  const restoreMutation = useMutation({
    mutationFn: (id) => axiosAuth.patch(`${EMP_API}/restore/${id}`),
    onSuccess: () => {
      toast.success("Employee restored");
      queryClient.invalidateQueries(["employees"]);
    },
  });

  // PERMANENT DELETE (use mutation)
  const permanentDeleteMutation = useMutation({
    mutationFn: (id) => axiosAuth.delete(`${EMP_API}/permanent-delete/${id}`),
    onSuccess: () => {
      toast.success("Employee permanently deleted");
      queryClient.invalidateQueries(["employees"]);
    },
  });

  
  // FORM HANDLERS
  
=======
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching employees");
    }
  };

  // Open/close modal
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
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
<<<<<<< HEAD

=======
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
  const closeModal = () => {
    setIsModalOpen(false);
    setErrorMsg("");
  };

<<<<<<< HEAD
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
      if (!validateEmail(formData.email)) {
    setErrorMsg("Email must be a valid Gmail address (example@gmail.com)");
    return;
  }


    if (!editId && formData.password.trim().length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    editId
      ? updateMutation.mutate({ id: editId, body: formData })
      : createMutation.mutate(formData);

    closeModal();
  };

=======
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
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
  const getPageNumbers = () => {
    const total = pagination.totalPages;
    const current = pagination.currentPage;
    let start = Math.max(current - 2, 1);
    let end = Math.min(start + 4, total);
    start = Math.max(end - 4, 1);
<<<<<<< HEAD
    return [...Array(end - start + 1)].map((_, i) => start + i);
=======
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
<<<<<<< HEAD
      <ToastContainer />

=======
      <ToastContainer position="top-right" autoClose={3000} />
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Employees</h1>
        <button
          onClick={() => openModal()}
<<<<<<< HEAD
          className="bg-blue-600 text-white px-4 py-2 rounded"
=======
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
        >
          Add Employee
        </button>
      </div>

<<<<<<< HEAD
      {/* Loading */}
      {isLoading && <p className="text-center">Loading employees...</p>}

      {/* Empty */}
      {!isLoading && employees.length === 0 && (
        <p className="text-center text-gray-500">No employees found</p>
      )}

      {/* TABLE */}
      {!isLoading && employees.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

=======
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
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
              <tbody>
                {employees.map((emp, index) => (
                  <tr
                    key={emp._id}
<<<<<<< HEAD
                    className={`border-b ${
                      emp.isDeleted ? "bg-gray-100 italic" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-3">
                      {(pagination.currentPage - 1) * pagination.perPage + index + 1}
                    </td>
=======
                    className={`border-b ${emp.isDeleted ? "bg-gray-100 italic text-gray-500" : "hover:bg-gray-50"}`}
                  >
                    <td className="p-3">{(pagination.currentPage - 1) * pagination.perPage + index + 1}</td>
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
                    <td className="p-3">{emp.name}</td>
                    <td className="p-3">{emp.email}</td>
                    <td className="p-3 capitalize">{emp.role}</td>
                    <td className="p-3">{emp.isDeleted ? "Deleted" : "Active"}</td>
<<<<<<< HEAD

                    <td className="p-3 flex gap-2 justify-center">
                      {!emp.isDeleted ? (
                        <>
                          <button
                            onClick={() => openModal(emp)}
                            className="text-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => softDeleteMutation.mutate(emp._id)}
                            className="text-red-600"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => restoreMutation.mutate(emp._id)}
                            className="text-green-600"
                          >
                            Restore
                          </button>

                          <button
                            onClick={() => permanentDeleteMutation.mutate(emp._id)}
                            className="text-red-800"
                          >
                            Permanent Delete
                          </button>
=======
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
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

<<<<<<< HEAD
          {/* PAGINATION */}
          <div className="flex justify-center mt-5 gap-2">
            <button
              disabled={pagination.currentPage === 1}
              onClick={() =>
                setPagination((p) => ({
                  ...p,
                  currentPage: Math.max(p.currentPage - 1, 1),
                }))
              }
              className="px-3 py-1 bg-gray-300 rounded"
=======
          {/* Pagination */}
          <div className="flex justify-center mt-5 gap-2 overflow-x-auto">
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(prev.currentPage - 1, 1) }))}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
            >
              Prev
            </button>

<<<<<<< HEAD
            {getPageNumbers().map((num) => (
              <button
                key={num}
                onClick={() =>
                  setPagination((p) => ({ ...p, currentPage: num }))
                }
                className={`px-3 py-1 rounded ${
                  pagination.currentPage === num
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {num}
=======
            {getPageNumbers().map(i => (
              <button
                key={i}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: i }))}
                className={`px-3 py-1 rounded ${pagination.currentPage === i ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                {i}
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
              </button>
            ))}

            <button
<<<<<<< HEAD
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() =>
                setPagination((p) => ({
                  ...p,
                  currentPage: Math.min(p.currentPage + 1, p.totalPages),
                }))
              }
              className="px-3 py-1 bg-gray-300 rounded"
=======
              onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(prev.currentPage + 1, pagination.totalPages) }))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
            >
              Next
            </button>
          </div>
        </>
      )}

<<<<<<< HEAD
      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 w-full max-w-lg rounded shadow">
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit Employee" : "Add Employee"}
            </h2>
             {errorMsg && (
                    <p className="text-red-600 text-sm text-center pb-4">{errorMsg}</p>
                  )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Employee Name"
                className="border p-2 rounded"
                required
              />

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Employee Email"
                className="border p-2 rounded"
                required
              />

              {!editId && (
                <>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="border p-2 rounded"
                    required
                  />
                 
                </>
              )}

              <input
                name="role"
                value={formData.role}
                readOnly
                className="border p-2 rounded"
              />
              

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editId ? "Update" : "Add"}
                </button>
=======
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
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEmployee;
