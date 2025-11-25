<<<<<<< HEAD
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

=======
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";


const ManageSalary = () => {
  const [salaries, setSalaries] = useState([]);
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
  const [formData, setFormData] = useState({
    employeeEmail: "",
    amount: "",
    month: "",
    year: "",
  });
<<<<<<< HEAD

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
=======
  const [editMode, setEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/salary/get-salary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalaries(res.data.salaries || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching salaries");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (salary = null) => {
    if (salary) {
      setEditMode(true);
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
      setFormData({
        employeeEmail: salary.email,
        amount: salary.amount,
        month: salary.month,
        year: salary.year,
      });
    } else {
<<<<<<< HEAD
      setEditSalary(null);
=======
      setEditMode(false);
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
      setFormData({ employeeEmail: "", amount: "", month: "", year: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

<<<<<<< HEAD
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
=======
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editMode) {
        res = await axios.put(
          "http://localhost:3000/api/salary/update-salary",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        res = await axios.post(
          "http://localhost:3000/api/salary/set-salary",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      toast.success(res.data.message);
      fetchSalaries();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
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
        <h1 className="text-2xl font-semibold">Manage Salaries</h1>
        <button
          onClick={() => openModal()}
<<<<<<< HEAD
          className="bg-blue-600 text-white px-4 py-2 rounded"
=======
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
        >
          Set Salary
        </button>
      </div>

<<<<<<< HEAD
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
=======
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Employee Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Month</th>
              <th className="p-3 text-left">Year</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.length > 0 ? (
              salaries.map((sal, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{sal.name}</td>
                  <td className="p-3">{sal.email}</td>
                  <td className="p-3 capitalize">{sal.month}</td>
                  <td className="p-3">{sal.year}</td>
                  <td className="p-3">{sal.amount}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => openModal(sal)}
                      className="text-blue-600 hover:underline"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No salary records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">
              {editMode ? "Update Salary" : "Set Salary"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                name="employeeEmail"
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
                placeholder="Employee Email"
                value={formData.employeeEmail}
                onChange={handleChange}
                className="border p-2 rounded"
                required
<<<<<<< HEAD
                readOnly={!!editSalary}
              />
              <input
=======
                readOnly={editMode}
              />
              <input
                type="text"
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
                name="month"
                placeholder="Month (e.g. January)"
                value={formData.month}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
<<<<<<< HEAD
                name="year"
                type="number"
=======
                type="number"
                name="year"
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
                placeholder="Year (e.g. 2025)"
                value={formData.year}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
<<<<<<< HEAD
                name="amount"
                type="number"
=======
                type="number"
                name="amount"
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

<<<<<<< HEAD
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded"
=======
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
                >
                  Cancel
                </button>
                <button
                  type="submit"
<<<<<<< HEAD
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editSalary ? "Update" : "Set"}
=======
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editMode ? "Update" : "Set"}
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
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
