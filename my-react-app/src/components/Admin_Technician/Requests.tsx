// Imports 
// ========================================================================================================================================================
import { useState, useEffect } from 'react';

// Interfaces 
// ========================================================================================================================================================
interface Request {
    id: number;
    description: string;
    status: string;
    categoryName: string;
    comments: string;
    actions: string;
    technician: number;
    createdAt: string;
    files: RequestFile[]
}

interface RequestFile {
    id: number;
    filename: string;
    downloadUrl: string;
}

interface Technician {
    id: number;
    username: string;  
}

// Main Component
// ========================================================================================================================================================
export default function Requests() {

    // States & Var 
    // ------------------------------------------------------------------------------------------------------------------
    const [error, setError] = useState(false);
    const [requests, setRequests] = useState<Request[]>([]);
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [success, setSuccess] = useState<boolean | null>(null);

    const [selectedRequests, setSelectedRequests] = useState<Record<number, [string, string, string, number | null]>>({});
    const statuses = ["NEW", "IN_PROGRESS", "COMPLETED"];

    // Retrieve Requests 
    // ------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                // Make fetch
                const res = await fetch("http://localhost:8080/api/requests?All=true", {credentials: "include"});

                // Check for Error
                if (!res.ok) return setError(true);

                // Get data
                const data: Request[] = await res.json();
                setRequests(data);

                // initialize role map
                const initialRequests: Record<number, [string, string, string, number]> = {};
                data.forEach(request => {
                    initialRequests[request.id] = [request.status, request.actions, request.comments, request.technician];
                });
                setSelectedRequests(initialRequests);
            } catch(error) {
                console.error(error);
            }
        }

        fetchRequests();
    }, [])

    // Retrieve Technicians 
    // ------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                // Make fetch
                const res = await fetch("http://localhost:8080/api/users?role=TECHNICIAN", {credentials: "include"});

                // Check for Error
                if (!res.ok) return setError(true);

                // Get data
                const data: Technician[] = await res.json();
                setTechnicians(data);
            } catch(error) {
                console.error(error);
            }
        }

        fetchTechnicians();
    }, [])

    // Handle Change 
    // ------------------------------------------------------------------------------------------------------------------
    async function updateRequest(id: number) {
        try {
            // Get Role for the corresponding User
            const request = selectedRequests[id];

            // Make fetch
            const res = await fetch("http://localhost:8080/api/requests", {
                method: "PUT", 
                credentials: "include", 
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify({id: id, status: request[0], actions: request[1], comments: request[2], technician: request[3]})
            });

            // Handle Result
            if (res.ok) {
                setSuccess(true);
            } else {
                setError(true);
            }
        } catch(error) {
            console.error(error);
        }
    }

    // JSX
    // ------------------------------------------------------------------------------------------------------------------
    return(
        <div className="min-h-screen bg-white">

            {/* Header */}
            <p className="mt-10 text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                Active Requests
            </p>

            {/* Main Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">

                {/* Show Error, if any */}
                { error && 
                    <p className="max-w-3/4 rounded-lg mx-auto p-3 text-lg mb-5 bg-red-300">
                        An error occurred when getting your requests. Please try again later.
                    </p>
                }

                {/* Show Success, if any */}
                { success && 
                    <p className="max-w-3/4 rounded-lg mx-auto p-3 text-lg mb-5 bg-green-300">
                        Successful Role Change!
                    </p>
                }

                {/* Display Requests */}
                {requests.length > 0 ? requests.map((request) => {
                    const [status, actions, comments, technician] = selectedRequests[request.id] || ["", "", "", 0];

                    return(
                    <div key={request.id} className="border-b-blue-800 bg-blue-200 rounded p-4 mb-4">
                        {/* Details */}
                        <p className="font-semibold">ID: <span className='font-normal'>{request.id}</span></p>
                        <p className="font-semibold">Category: <span className='font-normal'>{request.categoryName}</span></p>
                        <p className="font-semibold">Description: <span className='font-normal'>{request.description}</span></p>
                        <p className="font-semibold">Created at: 
                            <span className='font-normal'>
                                {new Date(request.createdAt).toLocaleString()}
                            </span>
                        </p>
                        
                        {/* Files */}
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

                        {/* Statuses */}
                        <p>Status:</p>
                        <select value={status} onChange={(e) => setSelectedRequests(prev => ({
                            ...prev,
                            [request.id]: [e.target.value, actions, comments, technician]
                        }))} >
                            {statuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        {/* Technicians */}
                        <p>Technician:</p>
                        <select value={technician ?? 0} onChange={(e) => setSelectedRequests(prev => ({
                            ...prev,
                            [request.id]: [status, actions, comments, Number(e.target.value) == 0 ? null : Number(e.target.value)]
                        }))} >
                            <option value={0}>Select a Technician</option>
                            {technicians.map((technician) => (
                                <option value={technician.id}>{technician.username}</option>
                            ))}
                        </select>

                        {/* Actions */}
                        <p>Actions:</p>
                        <input
                            type="text"
                            value={actions}
                            onChange={(e) => setSelectedRequests(prev => ({
                            ...prev,
                            [request.id]: [status, e.target.value, comments, technician]
                        }))} />
                        
                        {/* Comments */}
                        <p>Comments:</p>
                        <input
                            type="text"
                            value={comments}
                            onChange={(e) => setSelectedRequests(prev => ({
                            ...prev,
                            [request.id]: [status, actions, e.target.value, technician]
                        }))} />

                        {/* Submit Button */}
                        <button
                            className="bg-green-600 text-white py-1 rounded hover:bg-green-700"
                            onClick={() => updateRequest(request.id)}
                        >
                            Confirm
                        </button>
                    </div>
                )}) : (
                    <p className={"h-96 max-w-3/4 rounded-lg m-auto p-3 mb-5 bg-blue-200 font-bold text-2xl flex items-center justify-center"}>
                        You have no active requests
                    </p>
                )}
            </section>
        </div>
    );
}