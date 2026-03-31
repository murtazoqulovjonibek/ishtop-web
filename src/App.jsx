import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import Admin from "./pages/Admin";
import Login from "./pages/Login";

// 🔐 PROTECTED ROUTE
function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  if (user === null) return <div>Loading...</div>;

  return user ? children : <div>Ruxsat yo‘q ❌</div>;
}

// 🌐 MAIN UI (SENIKI)
function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const snapshot = await getDocs(collection(db, "jobs"));

        let data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        data.sort((a, b) => (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0));

        setJobs(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-10">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tight text-blue-600">
            Ish<span className="text-slate-800">Top</span>
          </h1>
          <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
            {jobs.length} ta vakansiya
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 mt-6">

        {/* Welcome */}
        <div className="mb-8 px-2">
          <h2 className="text-xl font-bold italic text-slate-800">
            Bugungi eng yaxshi takliflar ✨
          </h2>
          <p className="text-slate-500 text-sm">
            O'zingizga mos ishni bugun toping
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-pulse text-slate-400 text-lg">
              Yuklanmoqda...
            </div>
          </div>
        )}

        {/* EMPTY */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            Hozircha ishlar yo‘q 😔
          </div>
        )}

        {/* JOBS */}
        <div className="grid gap-6">
          {jobs.map(job => (
            <div
              key={job.id}
              className={`relative group bg-white border border-slate-200 p-5 rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                job.isPremium ? "ring-2 ring-orange-400 border-transparent" : ""
              }`}
            >

              {job.isPremium && (
                <div className="absolute -top-3 right-5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                  🔥 VIP ISH
                </div>
              )}

              <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="whitespace-pre-line text-[15px]">
                    {job.text}
                  </p>
                </div>

                <a
                  href={`https://t.me/ishtopapp_bot?start=${job.id}`}
                  target="_blank"
                  className={`flex justify-center w-full py-4 rounded-2xl text-white ${
                    job.isPremium
                      ? "bg-orange-500"
                      : "bg-slate-900"
                  }`}
                >
                  Ariza berish
                </a>
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

// 🚀 APP ROUTER
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;