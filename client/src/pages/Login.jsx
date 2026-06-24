import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import toast from "react-hot-toast";

function Login() {
  const usernameRef = useRef("");
  const passwordRef = useRef("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        username: usernameRef.current,
        password: passwordRef.current,
      });

      sessionStorage.setItem("token", res.data.token);
      navigate("/admin");
    } catch {
      toast.error("Login failed. Check your username and password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-pos-bg px-4 py-16">
      <div className="w-full max-w-md rounded-[10px] border border-pos-border bg-white p-10 shadow-lg">
        <h2 className="text-2xl font-bold text-pos-text">Admin Login</h2>
        <p className="mt-2 text-sm text-pos-muted">Sign in to open the dashboard.</p>

        <div className="mt-8 space-y-5">
          <input
            className="w-full rounded-md border border-pos-border px-4 py-3 text-pos-text placeholder:text-pos-muted focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
            placeholder="Username"
            aria-label="Username"
            onChange={(e) => { usernameRef.current = e.target.value; }}
          />

          <input
            className="w-full rounded-md border border-pos-border px-4 py-3 text-pos-text placeholder:text-pos-muted focus:border-pos-orange focus:outline-none focus:ring-2 focus:ring-pos-peach"
            type="password"
            placeholder="Password"
            aria-label="Password"
            onChange={(e) => { passwordRef.current = e.target.value; }}
          />

          <button
            type="button"
            onClick={handleLogin}
            className="w-full rounded-md bg-pos-orange py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pos-orange-hover focus:outline-none focus:ring-2 focus:ring-pos-peach"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
