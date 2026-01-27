// Imports 
// ===================================================================================================================================================
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


// Context Creation 
// ===================================================================================================================================================
type AuthContextType = {
  authenticated: boolean;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  role: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

// Initialization
// ===================================================================================================================================================
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Navigator
  const navigate = useNavigate();

  // Define Login Status
  // -----------------------------------------------------------------------------------------------
  const [state, setState] = useState({
    authenticated: false,
    role: null,
    loading: true,
  });


  // Fetch Login status
  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    fetch("http://localhost:8080/api/auth/check", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setState({
            authenticated: true,
            role: data.role,
            loading: false,
          });
        } else {
          setState({ authenticated: false, role: null, loading: false });
        }
      });
  }, []);

  // Login
  // -----------------------------------------------------------------------------------------------
  const login = async (email: string, password: string) => {
    try {
      // Indicate Loading
      setState(prev => ({ ...prev, loading: true }));

      // Make fetch
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Check Response
      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      // Get data
      const data = await res.json();
      setState({
        authenticated: true,
        role: data.role,
        loading: false,
      });

      // Then navigate
      if (data.role === "NOT_DETERMINED") {
        navigate("/unknownHome");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed:", error);

      setState({
        authenticated: false,
        role: null,
        loading: false,
      });

      throw error; 
    }
  };


  // Logout
  // -----------------------------------------------------------------------------------------------
  const logout = async () => {
    try {
      // Make fetch
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setState({
        authenticated: false,
        role: null,
        loading: false,
      });

      // Navigate to Intro
      navigate("/");
    }
  };


  // Provide the values
  // -----------------------------------------------------------------------------------------------
  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
