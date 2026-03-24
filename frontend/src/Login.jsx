import React, { useState } from "react";
import { LogIn, UserPlus, Eye, EyeOff, Lock, Mail } from "lucide-react";
import {CAN_REGISTER_USER, API_BASE_URL} from "./utils/api";

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #eff6ff, #e0e7ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    fontFamily: '"Inter", sans-serif',
  },
  card: {
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    padding: "3rem",
    maxWidth: "450px",
    width: "100%",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  logo: {
    width: "80px",
    height: "80px",
    backgroundColor: "#4f46e5",
    borderRadius: "50%",
    margin: "0 auto 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "0.5rem",
    fontFamily: '"Montserrat", sans-serif',
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "0.95rem",
  },
  tabs: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "2rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "0.5rem",
    padding: "0.25rem",
  },
  tab: {
    flex: 1,
    padding: "0.75rem",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    color: "#6b7280",
    transition: "all 0.2s",
  },
  tabActive: {
    backgroundColor: "white",
    color: "#4f46e5",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  formGroup: {
    position: "relative",
  },
  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "0.5rem",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "1rem",
    color: "#9ca3af",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "0.875rem 1rem 0.875rem 3rem",
    fontSize: "1rem",
    border: "2px solid #e5e7eb",
    borderRadius: "0.5rem",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
  },
  inputFocus: {
    borderColor: "#4f46e5",
    boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
  },
  togglePassword: {
    position: "absolute",
    right: "1rem",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0.5rem",
    color: "#9ca3af",
    display: "flex",
    alignItems: "center",
    transition: "color 0.2s",
  },
  togglePasswordHover: {
    color: "#4f46e5",
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.875rem 1rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "all 0.2s",
    marginTop: "0.5rem",
  },
  buttonHover: {
    backgroundColor: "#4338ca",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed",
    transform: "none",
  },
  error: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "0.875rem",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    marginBottom: "1rem",
  },
  passwordRequirements: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginTop: "0.5rem",
    lineHeight: "1.5",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    margin: "1.5rem 0",
    fontSize: "0.875rem",
    color: "#6b7280",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#e5e7eb",
  },
};

function Login({ onLoginSuccess }) {
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const body =
        mode === "login"
          ? { email: formData.email, password: formData.password }
          : {
              email: formData.email,
              password: formData.password,
              username: formData.username,
            };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${mode}`);
      }

      // Save token to localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Call success callback
      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setError(err.message);
      console.error(`${mode} error:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types
  };

  const isLoginMode = mode === "login";
  const canRegister = CAN_REGISTER_USER;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <Lock size={40} color="white" />
          </div>
          <h1 style={styles.title}>X User Manager</h1>
          <p style={styles.subtitle}>
            {isLoginMode ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        <div style={styles.tabs}>
          <button
            onClick={() => {
              setMode("login");
              setError("");
            }}
            style={{
              ...styles.tab,
              ...(isLoginMode ? styles.tabActive : {}),
            }}
          >
            <LogIn
              size={18}
              style={{ display: "inline", marginRight: "0.5rem" }}
            />
            Login
          </button>
          {canRegister=='true' && (
            <button
              onClick={() => {
                setMode("register");
                setError("");
              }}
              style={{
                ...styles.tab,
                ...(!isLoginMode ? styles.tabActive : {}),
              }}
            >
              <UserPlus
                size={18}
                style={{ display: "inline", marginRight: "0.5rem" }}
              />
              Register
            </button>
          )}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLoginMode && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Username</label>
              <div style={styles.inputWrapper}>
                <div style={styles.inputIcon}>
                  <UserPlus size={20} />
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  onFocus={() => setFocusedInput("username")}
                  onBlur={() => setFocusedInput(null)}
                  style={{
                    ...styles.input,
                    ...(focusedInput === "username" ? styles.inputFocus : {}),
                  }}
                  placeholder="Enter username"
                  required={!isLoginMode}
                  autoComplete="username"
                />
              </div>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}>
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                style={{
                  ...styles.input,
                  ...(focusedInput === "email" ? styles.inputFocus : {}),
                }}
                placeholder="Enter email"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}>
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                style={{
                  ...styles.input,
                  paddingRight: "3rem",
                  ...(focusedInput === "password" ? styles.inputFocus : {}),
                }}
                placeholder="Enter password"
                required
                autoComplete={isLoginMode ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  ...styles.togglePassword,
                  ...(hoveredButton === "toggle"
                    ? styles.togglePasswordHover
                    : {}),
                }}
                onMouseEnter={() => setHoveredButton("toggle")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {!isLoginMode && (
              <div style={styles.passwordRequirements}>
                Password must be at least 8 characters with uppercase,
                lowercase, and number
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(hoveredButton === "submit" && !loading
                ? styles.buttonHover
                : {}),
              ...(loading ? styles.buttonDisabled : {}),
            }}
            onMouseEnter={() => setHoveredButton("submit")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {loading ? (
              <>Loading...</>
            ) : isLoginMode ? (
              <>
                <LogIn size={20} />
                Sign In
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Create Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
