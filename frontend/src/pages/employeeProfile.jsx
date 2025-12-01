import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import  { PRO_API, BASE_API }  from "../config.js";
// export const BASE_API = import.meta.env.VITE_API_BASE_URL;
// export const PRO_API = `${BASE_API}/emp-profile`;

const token = localStorage.getItem("token");
const axiosAuth = axios.create({
  headers: { Authorization: `Bearer ${token}` },
});

const EmployeeProfile = () => {
  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [originalData, setOriginalData] = useState({ name: "", profileImage: "" });

  // FETCH PROFILE
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axiosAuth.get(`${PRO_API}/profile`);
      const data = res.data.data;

      // set only name for editing
      setFormData({ name: data.name || "" });
      setOriginalData({ name: data.name || "", profileImage: data.profileImage || "" });

      return data;
    },
  });

  // UPDATE PROFILE
  const updateMutation = useMutation({
  mutationFn: async (body) => {
    const fd = new FormData();
    if (body.name !== originalData.name) fd.append("name", body.name);
    if (previewImage) fd.append("profileImage", previewImage); // <-- use previewImage
    return axiosAuth.put(`${PRO_API}/update`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  onSuccess: (res) => {
    toast.success("Profile updated successfully!");
    setEditMode(false);
    queryClient.invalidateQueries(["profile"]);
    setPreviewImage(null);
    setOriginalData({
      name: res.data.data.name,
      profileImage: res.data.data.profileImage,
    });
  },
  onError: (err) =>
    toast.error(err.response?.data?.message || "Error updating profile"),
});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // prevent update if nothing changed
    if (formData.name === originalData.name && !previewImage) {
      toast.info("No changes to update");
      return;
    }
    updateMutation.mutate(formData);
  };

  if (isLoading) return <p className="text-center">Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 mt-10">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-center mb-4">Employee Profile</h2>

      {/* PROFILE IMAGE */}
      <div className="flex justify-center mb-4">
        <img
          src={
  previewImage
    ? URL.createObjectURL(previewImage)
    : profile?.profileImage?.startsWith("http")
    ? profile.profileImage
    : `${BASE_API}${profile.profileImage}`
}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover shadow"
        />
      </div>

      {/* IMAGE UPLOAD */}
      {editMode && (
        <div className="text-center mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPreviewImage(e.target.files[0])}
          />
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME (editable) */}
        <input
          type="text"
          name="name"
          value={formData.name}
          disabled={!editMode}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Name"
        />

        {/* EMAIL (read-only) */}
        <input
          type="email"
          value={profile?.email || ""}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
          placeholder="Email"
        />

        {/* SALARY (read-only) */}
        <input
          type="number"
          value={profile?.salary || ""}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
          placeholder="Salary"
        />

        {/* ROLE (read-only) */}
        <input
          type="text"
          value={profile?.role || ""}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
          placeholder="Role"
        />

        {/* DEPARTMENTS (read-only) */}
        <input
          type="text"
          value={profile?.departments?.join(", ") || ""}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
          placeholder="Departments"
        />

        {/* BUTTONS */}
        <div className="flex justify-between mt-4">
          {!editMode ? (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setPreviewImage(null);
                  setFormData({ name: originalData.name });
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default EmployeeProfile;
