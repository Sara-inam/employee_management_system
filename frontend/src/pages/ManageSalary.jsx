import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { SALARY_API } from "../config";


const token = localStorage.getItem("token");

const axiosAuth = axios.create({
  headers: { Authorization: `Bearer ${token}` },
});

const ManageSalary = () => {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
  });

  const [formData, setFormData] = useState({
    employeeEmail: "",
    amount: "",
    month: "",
    year: "",
  });

  const [editSalary, setEditSalary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FETCH SALARIES
  const { data: salariesData, isLoading } = useQuery({
    queryKey: ["salaries", pagination.currentPage],
    queryFn: async () => {
      const res = await axiosAuth.get(
        `${SALARY_API}/get-salary?page=${pagination.currentPage}&limit=${pagination.perPage}`
      );

      setPagination({
        currentPage: res.data.page || 1,
        totalPages: res.data.totalPages || 1,
        perPage: pagination.perPage,
      });

      return res.data.salaries || [];
    },
    keepPreviousData: true,
  });

  const salaries = salariesData || [];

  // CREATE / UPDATE SALARY
  const mutation = useMutation({
    mutationFn: (body) =>
      editSalary
        ? axiosAuth.put(`${SALARY_API}/update-salary`, body)
        : axiosAuth.post(`${SALARY_API}/set-salary`, body),
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries(["salaries"]);
      closeModal();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Error"),
  });

  // MODAL HANDLERS
  const openModal = (salary = null) => {
    if (salary) {
      setEditSalary(salary);
      setFormData({
        employeeEmail: salary.email,
        amount: salary.amount,
        month: salary.month,
        year: salary.year,
      });
    } else {
      setEditSalary(null);
      setFormData({ employeeEmail: "", amount: "", month: "", year: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  // SAFE PAGINATION
  const getPageNumbers = () => {
    const total = pagination.totalPages || 1;
    const current = pagination.currentPage || 1;
    let start = Math.max(current - 2, 1);
    let end = Math.min(start + 4, total);
    start = Math.max(end - 4, 1);
    return [...Array(end - start + 1)].map((_, i) => start + i);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Salaries</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Set Salary
        </button>
      </div>

      {isLoading && <p className="text-center">Loading salaries...</p>}
      {!isLoading && salaries.length === 0 && (
        <p className="text-center text-gray-500">No salaries found</p>
      )}

      {!isLoading && salaries.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Employee Email</th>
                  <th className="p-3">Month</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map((sal, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {(pagination.currentPage - 1) * pagination.perPage + idx + 1}
                    </td>
                    <td className="p-3">{sal.email}</td>
                    <td className="p-3 capitalize">{sal.month}</td>
                    <td className="p-3">{sal.year}</td>
                    <td className="p-3">{sal.amount}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => openModal(sal)}
                        className="text-blue-600"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center mt-5 gap-2">
            <button
              disabled={pagination.currentPage <= 1}
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
                onClick={() => setPagination((p) => ({ ...p, currentPage: num }))}
                className={`px-3 py-1 rounded ${
                  pagination.currentPage === num ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              disabled={pagination.currentPage >= (pagination.totalPages || 1)}
              onClick={() =>
                setPagination((p) => ({
                  ...p,
                  currentPage: Math.min(p.currentPage + 1, pagination.totalPages || 1),
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
              {editSalary ? "Update Salary" : "Set Salary"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                name="employeeEmail"
                type="email"
                placeholder="Employee Email"
                value={formData.employeeEmail}
                onChange={handleChange}
                className="border p-2 rounded"
                required
                readOnly={!!editSalary}
              />
              <input
                name="month"
                placeholder="Month (e.g. January)"
                value={formData.month}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                name="year"
                type="number"
                placeholder="Year (e.g. 2025)"
                value={formData.year}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                name="amount"
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
                className="border p-2 rounded"
                required
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
                  {editSalary ? "Update" : "Set"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSalary;
