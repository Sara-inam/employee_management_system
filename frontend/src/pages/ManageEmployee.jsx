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

 
  // FETCH EMPLOYEES (TanStack Query)

  const { data, isLoading } = useQuery({
    queryKey: ["employees", pagination.currentPage],
    queryFn: async () => {
      const res = await axiosAuth.get(
        `${EMP_API}/get-employee?page=${pagination.currentPage}&limit=${pagination.perPage}`
      );

      setPagination({
        currentPage: res.data.pagination.currentPage,
        totalPages: res.data.pagination.totalPages,
        perPage: res.data.pagination.perPage,
      });

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

  const getPageNumbers = () => {
    const total = pagination.totalPages;
    const current = pagination.currentPage;
    let start = Math.max(current - 2, 1);
    let end = Math.min(start + 4, total);
    start = Math.max(end - 4, 1);
    return [...Array(end - start + 1)].map((_, i) => start + i);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Employees</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Employee
        </button>
      </div>

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

              <tbody>
                {employees.map((emp, index) => (
                  <tr
                    key={emp._id}
                    className={`border-b ${
                      emp.isDeleted ? "bg-gray-100 italic" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-3">
                      {(pagination.currentPage - 1) * pagination.perPage + index + 1}
                    </td>
                    <td className="p-3">{emp.name}</td>
                    <td className="p-3">{emp.email}</td>
                    <td className="p-3 capitalize">{emp.role}</td>
                    <td className="p-3">{emp.isDeleted ? "Deleted" : "Active"}</td>

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
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
            >
              Prev
            </button>

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
              </button>
            ))}

            <button
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() =>
                setPagination((p) => ({
                  ...p,
                  currentPage: Math.min(p.currentPage + 1, p.totalPages),
                }))
              }
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Next
            </button>
          </div>
        </>
      )}

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
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEmployee;
