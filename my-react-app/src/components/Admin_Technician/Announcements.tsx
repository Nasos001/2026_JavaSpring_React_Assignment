// Imports
// ===========================================================================================================================================================
import { useState } from 'react';


// Interfaces
// ===========================================================================================================================================================
interface Announcement {
    title: string;
    content: string;
}

// Main Component
// ===========================================================================================================================================================
export default function Announcements() {
    // States ----------------------------------------------------------------------------------
    const [announcement, setAnnouncement] = useState<Announcement>({title: "", content: ""});
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    // Handle Announcement ---------------------------------------------------------------------
    const handleAnnouncement = async () => {
        // Make fetch
        const res = await fetch("http://localhost:8080/api/announcements", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({title: announcement.title, content: announcement.content})
        });

        // Check Response
        if (res.ok) {
            setSuccess(true);
            setAnnouncement({title: "", content: ""});
            
        } else {
            setError(true);
        }
    }

    // JSX --------------------------------------------------------------------------------------
    return(
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 h-screen flex items-center justify-center">
            {/* Show Error, if any */}
            { error && 
                <p className="max-w-3/4 rounded-lg mx-auto p-3 text-lg mb-5 bg-red-300">
                    An error occurred. Please try again later.
                </p>
            }

            {/* Show Success, if any */}
            { success && 
                <p className="max-w-3/4 rounded-lg mx-auto p-3 text-lg mb-5 bg-green-300">
                    Successful Announcement!
                </p>
            }

            <form className="space-y-4 w-lg" onSubmit={handleAnnouncement}>
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            name="title"
                            value={announcement.title}
                            onChange={(e) => setAnnouncement((prev) => ({...prev, [e.target.name]: e.target.value }))}
                            placeholder="ex. Maintenance"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                        </label>
                        <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-50"
                            value={announcement.content}
                            name="content"
                            onChange={(e) => setAnnouncement((prev) => ({...prev, [e.target.name]: e.target.value }))}
                            placeholder="On January..."
                            required
                        />
                    </div>

                    <button className="w-3/4 mx-auto block rounded-lg bg-blue-600 py-2.5 text-white text-sm mt-5 font-medium hover:bg-blue-700 transition"
                        type="submit"
                    >
                        Announce
                    </button>
            </form>
        </section>
    )
}