import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import toyotaLogo from "../Assets/toyota-logo.png"; // <-- place your 1267.png here as toyota-logo.png
import bgvideo from "../Assets/login_page.mp4"
const roles = [
  "IT Admin",
  "CC/CG Admin",
  "Auditor",
  "Management User",
  "Reviewer",
  "Manager",
  "Auditee",
] as const;

type Role = (typeof roles)[number];

export function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
    role: Role | "";
  }>({
    username: "",
    password: "",
    role: "",
  });
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.role) {
      localStorage.setItem("userRole", credentials.role);
      navigate("/dashboard");
    }
  };

  const usernameActive = usernameFocused || credentials.username !== "";
  const passwordActive = passwordFocused || credentials.password !== "";

  return (
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-end pr-48">
      {/* ── VIDEO BACKGROUND ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={bgvideo}
        autoPlay
        loop
        muted
        playsInline
        style={{ transform: "scaleX(-1)" }}
      />

      {/* ── RED OVERLAY ── */}
      <div className="absolute inset-0 bg-red-800/50" />

      {/* ── LEFT BRANDING ── */}
      <div className="absolute left-16 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center text-white select-none ml-48">
        <img
          src={toyotaLogo}
          alt="Toyota Logo"
          className="w-64 h-64 object-contain mb-2 drop-shadow-2xl"
          // style={{ filter: "brightness(0) invert(1)" }}
        />
        <div className="mb-24">
          <h1 className="text-7xl font-bold leading-tight drop-shadow-lg text-center">
          CAGM
        </h1>
        <p className="mt-3 text-xl font-medium text-white/90 drop-shadow text-center">
          Compliance and Governance Monitoring Tool
        </p>
        </div>
      </div>

      {/* ── LOGIN CARD ── */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-[460px] px-11 py-12 ">
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-[#CC0000] text-center mb-1 tracking-tight">
          Welcome
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Sign in to enjoy the feature of Revolution
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* ── USERNAME ── */}
          <div
            className={`relative border rounded-lg transition-colors duration-200 ${
              usernameActive ? "border-[#CC0000]" : "border-gray-300"
            }`}
          >
            {usernameActive && (
              <span className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-[#CC0000] font-medium">
                User Name
              </span>
            )}
            <input
              type="text"
              placeholder={usernameActive ? "" : "Enter your user name"}
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
              className="w-full px-4 py-3.5 text-sm text-gray-700 outline-none bg-transparent rounded-lg placeholder-gray-400"
              required
            />
          </div>

          {/* ── PASSWORD ── */}
          <div
            className={`relative border rounded-lg transition-colors duration-200 ${
              passwordActive ? "border-[#CC0000]" : "border-gray-300"
            }`}
          >
            {passwordActive && (
              <span className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-[#CC0000] font-medium">
                Password
              </span>
            )}
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={passwordActive ? "" : "Password"}
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="flex-1 px-4 py-3.5 text-sm text-gray-700 outline-none bg-transparent rounded-lg placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-4 text-gray-400 hover:text-[#CC0000] transition-colors"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* ── ROLES DROPDOWN ── */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setRoleOpen(!roleOpen)}
              className={`w-full flex items-center justify-between px-4 py-3.5 border rounded-lg text-sm transition-colors duration-200 bg-white ${
                roleOpen
                  ? "border-[#CC0000] rounded-b-none"
                  : "border-gray-300"
              } ${credentials.role ? "text-gray-700" : "text-gray-400"}`}
            >
              <span>{credentials.role || "Roles"}</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${
                  roleOpen ? "rotate-180 text-[#CC0000]" : "text-gray-400"
                }`}
              />
            </button>

            {roleOpen && (
              <div className="absolute left-0 right-0 top-full border border-[#CC0000] border-t-0 rounded-b-lg bg-white z-50 shadow-lg overflow-hidden">
                {roles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setCredentials({ ...credentials, role });
                      setRoleOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-red-50 hover:text-[#CC0000] ${
                      credentials.role === role
                        ? "bg-red-50 text-[#CC0000] font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── KEEP ME LOGGED IN ── */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              className="w-4 h-4 accent-[#CC0000] cursor-pointer"
            />
            <span className="text-sm text-gray-600">Keep me logged in</span>
          </label>

          {/* ── SIGN IN BUTTON ── */}
          <button
            type="submit"
            className="w-full h-14 bg-[#CC0000] hover:bg-[#AA0000] active:scale-[0.99] text-white font-bold py-4 rounded-lg text-lg tracking-wide transition-all duration-200 shadow-md mt-1"
          >
            Sign In
          </button>

          {/* ── CREATE ACCOUNT ── */}
          <p className="text-center text-sm text-gray-500 mt-1">
            Need an account?{" "}
            <a
              href="#"
              className="text-[#CC0000] font-semibold underline hover:text-[#AA0000] transition-colors"
            >
              Create one
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}