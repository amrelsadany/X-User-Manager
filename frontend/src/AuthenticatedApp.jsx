import React, { useState, useEffect } from "react";
import Login from "./Login";
import App from "./App";
import { LogOut, User, RefreshCw } from "lucide-react";

const styles = {
  navbar: {
    backgroundColor: "white",
    borderBottom: "1px solid #e5e7eb",
    padding: "0.5rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  navTitle: {
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 700,
    fontSize: "2rem",
    color: "#1f2937",
    // marginBottom: "0.5rem",
    // display: "contents",
    margin: 0, 
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "0.5rem",
  },
  userName: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
  },
  userEmail: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  logoutButtonHover: {
    backgroundColor: "#dc2626",
  },
  loadingContainer: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #eff6ff, #e0e7ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContent: {
    textAlign: "center",
  },
  loadingText: {
    color: "#4b5563",
    fontSize: "1.125rem",
    marginTop: "1rem",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#6b7280",
    margin: 0,
  },
  titleSeparator: {
    fontSize: "1.8rem",
    // marginBottom: "0.5rem",
    color: "#d1d5db",
    margin: 0,
  },
};

function AuthenticatedApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredButton, setHoveredButton] = useState(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }, []);

  // Check if user is already logged in on component mount
  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      setLoading(false);
      return;
    }

    try {
      // Verify token with backend
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(storedToken);
        setIsAuthenticated(true);
      } else {
        // Token invalid or expired
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Token verification error:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <RefreshCw
            size={48}
            color="#4f46e5"
            style={{ animation: "spin 1s linear infinite" }}
          />
          <p style={styles.loadingText}>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <h1 style={styles.navTitle}>X User Manager</h1>
          <span style={styles.titleSeparator}>|</span>
          <p style={styles.subtitle}>Manage your saved X profiles</p>
        </div>
        <div style={styles.navRight}>
          {/* <div style={styles.userInfo}>
            <User size={20} color="#4f46e5" />
            <div>
              <div style={styles.userName}>{user.username}</div>
              <div style={styles.userEmail}>{user.email}</div>
            </div>
          </div> */}
          <button
            onClick={handleLogout}
            style={{
              ...styles.logoutButton,
              ...(hoveredButton === "logout" ? styles.logoutButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredButton("logout")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>
      <App token={token} />
    </>
  );
}

export default AuthenticatedApp;
