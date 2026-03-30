import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

function App() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const snapshot = await getDocs(collection(db, "jobs"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobs(data);
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-10">
      {/* Header Section */}
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
        {/* Welcome Text */}
        <div className="mb-8 px-2">
          <h2 className="text-xl font-bold italic text-slate-800">Bugungi eng yaxshi takliflar ✨</h2>
          <p className="text-slate-500 text-sm">O'zingizga mos ishni bugun toping</p>
        </div>

        {/* Jobs List */}
        <div className="grid gap-6">
          {jobs.map(job => (
            <div
              key={job.id}
              className={`relative group bg-white border border-slate-200 p-5 rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                job.isPremium ? "ring-2 ring-orange-400 border-transparent" : ""
              }`}
            >
              {/* Premium Badge */}
              {job.isPremium && (
                <div className="absolute -top-3 right-5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                  🔥 VIP ISH
                </div>
              )}

              {/* Job Content */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-blue-50 transition-colors">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line text-[15px]">
                      {job.text}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <a
                  href={`https://t.me/ishtopapp_bot?start=${job.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-slate-200"
                >
                  <span>Ariza berish</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {jobs.length === 0 && (
          <div className="text-center py-20">
            <div className="animate-pulse text-slate-400 text-lg">Vakansiyalar yuklanmoqda...</div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;