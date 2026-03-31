import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err) {
      setError("Email yoki parol noto‘g‘ri ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">

      <div className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-xl border border-slate-200">

        {/* LOGO */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-blue-600">
            Ish<span className="text-slate-800">Top</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Admin panelga kirish
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded-xl mb-3 text-center">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <div className="relative mb-4">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={() => setShow(!show)}
            className="absolute right-3 top-3 text-sm text-slate-500"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition active:scale-95"
        >
          {loading ? "Kirish..." : "Login"}
        </button>

        {/* FOOTER */}
        <p className="text-center text-xs text-slate-400 mt-4">
          Faqat admin uchun 🔐
        </p>

      </div>

    </div>
  );
}

export default Login;