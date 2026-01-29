// Imports 
// ===========================================================================================================================================================
import { useEffect, useState } from "react";
import { useAuth } from "../Contexts/AuthContext";

// Interfaces
// ===========================================================================================================================================================
interface Welcome {
  user: string,
  questions: string[]
}

interface Announcement {
  title: string;
  content: string;
  createdAt: string;
}

// Main Component
// ===========================================================================================================================================================
export default function HomePage() {
  // States & Variables 
  // -----------------------------------------------------------------------------------------------------------------
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [error, setError] = useState<string>();
  const {role} = useAuth();

  // Fetch Announcements
  // -----------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchAnnouncements = async () => {
    try {
      // Make fetch
      const res = await fetch("http://localhost:8080/api/announcements", {
        credentials: "include"
      });

      // Check Response
      if (res.ok) {
        setAnnouncements(await res.json() as Announcement[]);
      } else {
        throw new Error("Error when getting the Announcements");
      }
    } catch(error) {
      console.error(error);
      setError("An error occurred when getting your announcements. Please try again later.")
    }
  }

    fetchAnnouncements();
  }, [])
  
  // Determine role
  // -----------------------------------------------------------------------------------------------------------------
  const welcome: Welcome = 
    role === "USER" ? {user: "User", questions: ["Make a new request?", "Monitor a request?", "Check your history?"]} 
    :
    role === "TECHNICIAN" ? {user: "Technician", questions: ["Assign a request?", "Update a Request?", "Complete a request?"]} 
    :
    {user: "Admin", questions: ["Check Registrations?", "Update a User's Info?", "Check Requests?"]}

  // JSX
  // -----------------------------------------------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white">

      {/* Main Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            An error occurred while getting your Announcements. Please try again later.
          </div>
        )}

        <div className="text-center">
          {/* Greeting */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            How can we help you today dear
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}{welcome.user}{" "}
            </span>
            ?
          </h1>
          
          {/* Questions */}
          <div className="relative mt-24 h-96">
            <div className="absolute top-0 left-5 p-5 text-bold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent py-6">
              {welcome.questions[0]}
            </div>

            <div className="absolute top-24 right-12 p-4 text-bold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent py-6">
              {welcome.questions[1]}
            </div>

            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 p-4 text-bold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent py-6">
              {welcome.questions[2]}
            </div>
          </div>
        </div>
      </section>

      {/* Invitation */}
      <div className="bottom-0 right-0 left-0 w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-6 mx-auto text-center text-4xl font-bold">
          Choose your next step from the header!
      </div>
    

      {/* Announcements */}
      <div className="bg-blue-950 border border-b-blue-400 w-full flex justify-center px-4">
        <div className="w-full max-w-3xl">
          <div className='text-center text-white font-bold text-3xl py-5'>
            Announcements
          </div>

          {announcements
            .filter(announcement => {
              const createdAt = new Date(announcement.createdAt).getTime();
              return Date.now() - createdAt <= 30 * 24 * 60 * 60 * 1000;
            })
            .map((announcement) => (
              <div className="border-b-blue-800 bg-blue-200 rounded p-4 mb-4 mt-5">
                <p className="font-bold text-lg sm:text-xl">{announcement.title}</p>
                <p className="font-semibold">Created at:{" "} 
                    <span className='font-normal'>
                        {new Date(announcement.createdAt).toLocaleString()} 
                    </span>
                </p>

                <textarea
                  className="mt-4 w-full h-40 sm:h-48 bg-white rounded-lg p-4 resize-none"
                  value={announcement.content}
                  readOnly
                />
              </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}