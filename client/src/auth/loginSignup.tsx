import React, { useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.email || !formData.password) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }
    if (!isLogin && formData.password !== formData.confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // LOGIN flow (Supabase)
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        // Optionally redirect or use toast:
        alert("Login successful!");
      } else {
        // SIGNUP flow (Supabase)
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        // Optionally redirect or use toast:
        alert("Account created! Please verify your email.");
      }
    } catch (err) {
      setError(err.error_description || err.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-800 py-12 px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8">
        <div className="flex justify-center mb-6">
          <span className="rounded-full shadow-md bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">
            <span className="tracking-tight">{isLogin ? "🔒" : "📝"}</span>
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-100 text-center mb-2">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <p className="text-slate-400 text-center mb-8">
          {isLogin ? "Welcome back!" : "Create your account"}
        </p>
        {error && (
          <div className="bg-red-900/60 text-red-200 border border-red-500 px-4 py-2 mb-4 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-100 placeholder:text-slate-500 transition-all"
              disabled={loading}
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-100 placeholder:text-slate-500 transition-all"
              disabled={loading}
            />
          </div>
          {!isLogin && (
            <div>
              <input
                name="confirm"
                type="password"
                required
                value={formData.confirm}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent text-slate-100 placeholder:text-slate-500 transition-all"
                disabled={loading}
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-semibold rounded-lg text-white shadow-lg
              ${
                isLogin
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-fuchsia-600 hover:brightness-110"
                  : "bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 hover:brightness-110"
              }
              transition-all duration-200 active:scale-95`}>
            {loading
              ? isLogin
                ? "Logging in..."
                : "Signing up..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
        </form>
        <div className="text-slate-400 text-center mt-6">
          {isLogin ? (
            <>
              New here?{" "}
              <button
                className="text-blue-400 hover:text-blue-300 underline font-semibold"
                onClick={() => {
                  setFormData({ email: "", password: "", confirm: "" });
                  setIsLogin(false);
                  setError("");
                }}
                disabled={loading}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-fuchsia-400 hover:text-fuchsia-300 underline font-semibold"
                onClick={() => {
                  setFormData({ email: "", password: "", confirm: "" });
                  setIsLogin(true);
                  setError("");
                }}
                disabled={loading}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
