import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";


const ManageSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [formData, setFormData] = useState({
    employeeEmail: "",
    amount: "",
    month: "",
    year: "",
  });
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
      setFormData({
        employeeEmail: salary.email,
        amount: salary.amount,
        month: salary.month,
        year: salary.year,
      });
    } else {
      setEditMode(false);
      setFormData({ employeeEmail: "", amount: "", month: "", year: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

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
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Salaries</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Set Salary
        </button>
      </div>

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
                placeholder="Employee Email"
                value={formData.employeeEmail}
                onChange={handleChange}
                className="border p-2 rounded"
                required
                readOnly={editMode}
              />
              <input
                type="text"
                name="month"
                placeholder="Month (e.g. January)"
                value={formData.month}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                name="year"
                placeholder="Year (e.g. 2025)"
                value={formData.year}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editMode ? "Update" : "Set"}
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
