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
    <div className="min-h-screen bg-gray-100 p-6">
      
      <h1 className="text-3xl font-bold mb-6 text-center">
        🚀 IshTop
      </h1>

      <div className="grid gap-4 max-w-xl mx-auto">
        {jobs.map(job => (
          <div
            key={job.id}
            className="bg-white p-4 rounded-2xl shadow-md"
          >
            
            {job.isPremium && (
              <div className="text-red-500 font-bold mb-2">
                🔥 VIP ISH
              </div>
            )}

            <p className="mb-3 whitespace-pre-line">
              {job.text}
            </p>

            <a href={`https://t.me/ishtopapp_bot?start=${job.id}`} target="_blank" className="block text-center bg-blue-500 text-white py-2 rounded-xl">
              📩 Ariza berish
            </a>

          </div>
        ))}
      </div>

    </div>
  );
}

export default App;