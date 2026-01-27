// Imports 
// ====================================================================================================================================================
import { useState, useEffect } from 'react';

// Interfaces 
// ====================================================================================================================================================
interface Request {
    id: number;
    description: string;
    status: string;
    categoryName: string;
    files: RequestFile[]
}

interface RequestFile {
    id: number;
    filename: string;
    downloadUrl: string;
}

// Main Component
// ====================================================================================================================================================
export default function MonitorRequests() {

    // States & Var 
    // ------------------------------------------------------------------------------------------------------------
    const [error, setError] = useState(false);
    const [requests, setRequests] = useState<Request[]>([])

    // Retrieve Ongoing Requests
    // ------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                // Make fetch
                const res = await fetch("http://localhost:8080/api/requests?excludeStatus=COMPLETED", {
                    credentials: "include"
                });

                // Check for Error
                if (!res.ok) return setError(true);

                // Get data
                const data: Request[] = await res.json();
                setRequests(data);
            } catch(error) {
                console.error(error);
            }
        }

        fetchRequests();
    }, [])

    // JSX 
    // ------------------------------------------------------------------------------------------------------------
    return(
        <div className="min-h-screen bg-white">
            <p className="mt-10 text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                Active Requests
            </p>

            {/* Main Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">

                {/* Show Error, if any */}
                { error && 
                    <p className="max-w-3/4 rounded-lg mx-auto p-3 text-lg mb-5bg-red-300">
                        An error occurred when getting your requests. Please try again later.
                    </p>
                }

                {requests.length > 0 ? requests.map((request) => (
                    <div key={request.id} className="border-b-blue-800 bg-blue-200 rounded p-4 mb-4">
                        <p className="font-semibold">Status: <span className='font-normal'>{request.status}</span></p>
                        <p className="font-semibold">Category: <span className='font-normal'>{request.categoryName}</span></p>
                        <p className="font-semibold">Description: <span className='font-normal'>{request.description}</span></p>

                        <br/>Files:

                        {request.files.length > 0 && (
                            <ul className="mt-2 list-disc list-inside">
                                {request.files.map(file => (
                                    <li key={file.id}>
                                        <a
                                            href={`http://localhost:8080${file.downloadUrl}`}
                                            className="text-blue-600 underline"
                                        >
                                            {file.filename}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )) : (
                    <p className={"h-96 max-w-3/4 rounded-lg m-auto p-3 mb-5 bg-blue-200 font-bold text-2xl flex items-center justify-center"}>
                        You have no active requests
                    </p>
                )}
            </section>

            
        </div>
    );
}