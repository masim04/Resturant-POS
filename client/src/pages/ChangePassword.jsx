import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const ChangePassword = () => {
   
  const navigate = useNavigate();
  const [oldPassword, setoldPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const handlePassword = async () => {
    try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to change password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    
      await axios.post(
        `${API_URL}/auth/change-password`,
        {
          oldPassword,
          newPassword,
        },{ headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password changed successfully");
      setnewPassword("");
      setoldPassword("");
      setconfirmPassword("");
    } catch (err) {
        console.error(err.response?.data || err.message);
      toast.error("Error changing password");
    }
  
  };
   
  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-pos-text">Change Password</h1>
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="font-medium text-pos-muted transition-colors hover:text-pos-text"
        >
          ← Back
        </button>
      </div>
      <div className="flex justify-center text-center items-center mt-23">
        <div className="w-full max-w-md rounded-[10px] border border-pos-border bg-white p-10 shadow-lg">
          <h2 className="text-2xl font-bold text-pos-text">Change Password</h2>

          <div className="mt-8 space-y-5">
            <input
            type="password"
              className="w-full rounded-md border border-pos-border px-4 py-3 text-pos-text placeholder:text-pos-muted focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setoldPassword(e.target.value)}
            />

            <input
              className="w-full rounded-md border border-pos-border px-4 py-3 text-pos-text placeholder:text-pos-muted focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setnewPassword(e.target.value)}
            />

            <input
              className="w-full rounded-md border border-pos-border px-4 py-3 text-pos-text placeholder:text-pos-muted focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
              type="password"
              value={confirmPassword}
              placeholder="Confirm New Password"
              onChange={(e) => setconfirmPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={handlePassword}
              className="w-full rounded-md bg-pos-orange py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pos-orange-hover focus:outline-none focus:ring-2 focus:ring-pos-peach"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
