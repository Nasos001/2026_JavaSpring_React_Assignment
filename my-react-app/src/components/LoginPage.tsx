// Imports 
// ===========================================================================================================================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

// Main Component 
// ===========================================================================================================================================================
export default function LoginPage() {
  // States & Variables
  // ---------------------------------------------------------------------------------------------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login_error, setError] = useState<string| null>(null);
  const {login, error} = useAuth();

  const navigate = useNavigate();

  // Handle Login 
  // ---------------------------------------------------------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
    } catch {
      setError("An error occurred");
    }
  };

  // JSX 
  // ---------------------------------------------------------------------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Form */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-center mb-6">Log In</h2>

        {/* Error Message, if any */}
        {(error || login_error) && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700 text-center">
          {error || login_error}
        </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              value={email}
              onChange={(e) => {setEmail(e.target.value); setError(null);}}
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              value={password}
              onChange={(e) => {setPassword(e.target.value); setError(null);}}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button className="w-3/4 mx-auto block rounded-lg bg-blue-600 py-2.5 text-white text-sm mt-5 font-medium hover:bg-blue-700 transition"
            type="submit"
          >
            Log In
          </button>
        </form>

        {/* Registration Link */}
        <p className="mt-4 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a className="text-blue-600 hover:underline hover:cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign up
          </a>
        </p>
      </div>
    </div> 
  );
}
