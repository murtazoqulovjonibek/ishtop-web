import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

function Admin() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    const snapshot = await getDocs(collection(db, "jobs"));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // VIP tepaga
    data.sort((a, b) => (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0));

    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ⭐ VIP toggle
  const toggleVip = async (id, current) => {
    await updateDoc(doc(db, "jobs", id), {
      isPremium: !current
    });
    fetchJobs();
  };

  // ❌ delete
  const removeJob = async (id) => {
    await deleteDoc(doc(db, "jobs", id));
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-6">

      {/* HEADER */}
      <div className="max-w-2xl mx-auto mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-black">
          🛠 Admin Panel
        </h1>

        <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
          {jobs.length} ta ish
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-20 text-slate-400 animate-pulse">
          Yuklanmoqda...
        </div>
      )}

      {/* JOB LIST */}
      <div className="max-w-2xl mx-auto grid gap-5">

        {jobs.map(job => (
          <div
            key={job.id}
            className={`relative bg-white p-5 rounded-3xl shadow transition hover:shadow-xl ${
              job.isPremium ? "ring-2 ring-orange-400" : ""
            }`}
          >

            {/* VIP BADGE */}
            {job.isPremium && (
              <div className="absolute -top-3 right-5 bg-linear-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                🔥 VIP
              </div>
            )}

            {/* JOB TEXT */}
            <p className="text-sm whitespace-pre-line mb-4 text-slate-700">
              {job.text}
            </p>

            {/* ACTIONS */}
            <div className="flex gap-2">

              {/* VIP BUTTON */}
              <button
                onClick={() => toggleVip(job.id, job.isPremium)}
                className={`flex-1 py-2 rounded-xl cursor-pointer text-white font-semibold transition ${
                  job.isPremium
                    ? "bg-gray-400 hover:bg-gray-500"
                    : "bg-orange-500 hover:bg-red-500"
                }`}
              >
                {job.isPremium ? "❌ VIP olib tashlash" : "⭐ VIP qilish"}
              </button>

              {/* DELETE */}
              <button
                onClick={() => removeJob(job.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 cursor-pointer text-white py-2 rounded-xl font-semibold"
              >
                🗑 O‘chirish
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Admin;