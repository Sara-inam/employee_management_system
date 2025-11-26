import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DEPT_API, EMP_API } from '../config.js';

const token = localStorage.getItem("token");

const axiosAuth = axios.create({
  headers: { Authorization: `Bearer ${token}` },
});

const validateEmail = (email) => /^[^\s@]+@gmail\.com$/.test(email);

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
    departments: [],
    salary: "",
  });

  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch departments
  const { data: allDepartmentsData } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await axiosAuth.get(`${DEPT_API}/get-department`);
      return res.data.departments || [];
    },
  });
  const allDepartments = allDepartmentsData || [];

  // Fetch employees
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

  // Create / Update / Delete Mutations
  const createMutation = useMutation({
    mutationFn: (body) => axiosAuth.post(`${EMP_API}/create-employee`, body),
    onSuccess: () => {
      toast.success("Employee created");
      queryClient.invalidateQueries(["employees"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }) => axiosAuth.put(`${EMP_API}/update-employee/${id}`, body),
    onSuccess: () => {
      toast.success("Employee updated");
      queryClient.invalidateQueries(["employees"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  const softDeleteMutation = useMutation({
    mutationFn: (id) => axiosAuth.patch(`${EMP_API}/soft-delete/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["employees"]),
  });

  const restoreMutation = useMutation({
    mutationFn: (id) => axiosAuth.patch(`${EMP_API}/restore/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["employees"]),
  });

  const permanentDeleteMutation = useMutation({
    mutationFn: (id) => axiosAuth.delete(`${EMP_API}/permanent-delete/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["employees"]),
  });

  // Modal
  const openModal = (emp = null) => {
    if (emp) {
      setEditId(emp._id);
      setFormData({
        name: emp.name,
        email: emp.email,
        password: "",
        role: emp.role,
        departments: emp.departments ? emp.departments.map(d => String(d._id)) : [],
        salary: emp.salary || "", // <- ye important
      });
    } else {
      setEditId(null);
      setFormData({ name: "", email: "", password: "", role: "employee", departments: [], salary: "" });
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

  // Pagination numbers (scrollable)
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
        <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Employee
        </button>
      </div>

      {isLoading && <p className="text-center">Loading employees...</p>}
      {!isLoading && employees.length === 0 && <p className="text-center text-gray-500">No employees found</p>}

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
                  <th className="p-3">Salary</th>
                  <th className="p-3">Departments</th>
                  <th className="p-3">Head Department</th>

                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => (
                  <tr key={emp._id} className={`border-b ${emp.isDeleted ? "bg-gray-100 italic" : "hover:bg-gray-50"}`}>
                    <td className="p-3">{(pagination.currentPage - 1) * pagination.perPage + index + 1}</td>
                    <td className="p-3">{emp.name}</td>
                    <td className="p-3">{emp.email}</td>
                    <td className="p-3 capitalize">{emp.role}</td>
                    <td className="p-3">{emp.salary || "-"}</td>

                    <td className="p-3">
                      {emp.departments && emp.departments.length > 0
                        ? emp.departments.map(d => d.name).join(", ")
                        : "-"}
                    </td>
                    <td className="p-3">
                      {emp.departments && emp.departments.length > 0
                        ? emp.departments
                          .filter(d => d.head && d.head._id === emp._id) // sirf wo department jiska wo head hai
                          .map(d => d.name)
                          .join(", ") || "-"  // agar head department nahi hai to "-"
                        : "-"}
                    </td>

                    <td className="p-3">{emp.isDeleted ? "Deleted" : "Active"}</td>
                    <td className="p-3 flex gap-2 justify-center">
                      {!emp.isDeleted ? (
                        <>
                          <button onClick={() => openModal(emp)} className="text-blue-600">Edit</button>
                          <button onClick={() => softDeleteMutation.mutate(emp._id)} className="text-red-600">Delete</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => restoreMutation.mutate(emp._id)} className="text-green-600">Restore</button>
                          <button onClick={() => permanentDeleteMutation.mutate(emp._id)} className="text-red-800">Permanent Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-5">
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(p.currentPage - 1, 1) }))}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <div className="overflow-x-auto max-w-[500px]">
                <div className="flex gap-2 whitespace-nowrap">
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPagination(p => ({ ...p, currentPage: pageNum }))}
                        className={`px-3 py-1 rounded ${pagination.currentPage === pageNum ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => setPagination(p => ({ ...p, currentPage: Math.min(p.currentPage + 1, p.totalPages) }))}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 w-full max-w-lg rounded shadow">
            <h2 className="text-xl font-semibold mb-4">{editId ? "Edit Employee" : "Add Employee"}</h2>
            {errorMsg && <p className="text-red-600 text-sm text-center pb-4">{errorMsg}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Employee Name" className="border p-2 rounded" required />
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Employee Email" className="border p-2 rounded" required />
              {!editId && <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="border p-2 rounded" required />}
              <input name="role" value={formData.role} readOnly className="border p-2 rounded" />
              <input name="salary" type="number" value={formData.salary} onChange={handleChange} placeholder="Employee Salary" className="border p-2 rounded" required />

              <div>
                <label className="block mb-1 font-medium">Departments</label>
                <div className="flex flex-col max-h-40 overflow-y-auto border p-2 rounded">
                  {allDepartments.map(dep => (
                    <label key={dep._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={String(dep._id)}
                        checked={formData.departments.includes(String(dep._id))}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            departments: prev.departments.includes(value)
                              ? prev.departments.filter(d => d !== value) // uncheck
                              : [...prev.departments, value],           // check
                          }));
                        }}
                      />
                      {dep.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editId ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEmployee;
