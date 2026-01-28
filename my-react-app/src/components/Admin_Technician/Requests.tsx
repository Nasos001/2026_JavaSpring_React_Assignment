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
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState<Request[]>([]);
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [success, setSuccess] = useState<string | null>(null);

    const [selectedRequests, setSelectedRequests] = useState<Record<number, [string, string, string, number | null]>>({});
    const [selectedStatus, setSelectedStatus] = useState("NEW")
    const statuses = ["NEW", "IN_PROGRESS", "COMPLETED"];

    // Retrieve Requests 
    // ------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);

            try {
                // Make fetch
                const res = await fetch("http://localhost:8080/api/requests?all=true", {credentials: "include"});

                // Check for Error
                if (!res.ok) {
                    const msg = await res.text();
                    throw new Error("Error when getting requests: " + msg);
                }

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
                setError(true);
            } finally {
                setLoading(false);
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
                if (!res.ok) {
                    const msg = await res.text();
                    throw new Error("Error when getting technicians: " + msg);
                }

                // Get data
                const data: Technician[] = await res.json();
                setTechnicians(data);
            } catch(error) {
                console.error(error);
                setError(true);
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
                setSuccess("The Request has been updated");
            } else {
                const msg = await res.text();
                throw new Error("Error when updating the Request:" + msg);
            }
        } catch(error) {
            console.error(error);
            setError(true);
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
                        {success}
                    </p>
                }

                { loading && <p className="text-center">Loading requests...</p> }

                { !loading && !error && requests.length === 0 && (
                    <p className={"h-96 max-w-3/4 rounded-lg m-auto p-3 mb-5 bg-blue-200 font-bold text-2xl flex items-center justify-center"}>
                        There are no active requests
                    </p>
                )}

                {/* Status Filter */}
                <div className='flex items-center text-center font-bold mb-5 gap-5'>
                    Status:
                    <select className='text-center bg-indigo-300 rounded p-1 font-semibold hover:bg-indigo-200'
                        value={selectedStatus} 
                        onChange={(e) => setSelectedStatus(e.target.value)}>
                            <option value={""}>All</option>
                        {statuses.map((s) => (
                            <option value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                

                {/* Display Requests */}
                {requests.length > 0 && requests.map((request) => {
                    const [status, actions, comments, technician] = selectedRequests[request.id] || ["", "", "", 0];

                    if (selectedStatus === status || selectedStatus === "") 
                    return(
                        <div key={request.id} className="border-b-blue-800 bg-blue-200 rounded p-4 mb-4">
                            {/* Details */}
                            <p className="font-semibold">ID: <span className='font-normal'>{request.id}</span></p>
                            <p className="font-semibold">Category: <span className='font-normal'>{request.categoryName}</span></p>
                            <p className="font-semibold">Description: <span className='font-normal'>{request.description}</span></p>
                            <p className="font-semibold">Created at:{" "} 
                                <span className='font-normal'>
                                    {new Date(request.createdAt).toLocaleString()}
                                </span>
                            </p> <br/>
                            
                            {/* Files */}
                            <p className="font-semibold">Files:</p>
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
                            )} <br/>

                            {/* Statuses */}
                            <div className='grid grid-cols-5'>
                                <p className="font-semibold">Status:</p>
                                <select className='bg-indigo-100 rounded p-1'
                                    value={status} 
                                    onChange={(e) => setSelectedRequests(prev => ({
                                    ...prev,
                                    [request.id]: [e.target.value, actions, comments, technician]
                                }))} >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Technicians */}
                            <div className='grid grid-cols-5 mt-3'>
                                <p className="font-semibold">Technician:</p>
                                <select className='bg-indigo-100 rounded p-1'
                                    value={technician ?? 0} 
                                    onChange={(e) => setSelectedRequests(prev => ({
                                        ...prev,
                                        [request.id]: [status, actions, comments, Number(e.target.value) == 0 ? null : Number(e.target.value)]
                                    }))} 
                                >
                                    <option value={0}>Select a Technician</option>
                                    {technicians.map((technician) => (
                                        <option value={technician.id}>{technician.username}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Actions */}
                            <p className="font-semibold mt-3">Actions:</p>
                            <textarea className='border border-slate-500 rounded-md p-1 h-32 w-lg bg-indigo-100'
                                value={actions}
                                onChange={(e) => setSelectedRequests(prev => ({
                                ...prev,
                                [request.id]: [status, e.target.value, comments, technician]
                            }))} />
                            
                            {/* Comments */}
                            <p className="font-semibold mt-3">Comments:</p>
                            <textarea className='border border-slate-500 rounded-md p-1 h-32 w-lg bg-indigo-100'
                                value={comments}
                                onChange={(e) => setSelectedRequests(prev => ({
                                ...prev,
                                [request.id]: [status, actions, e.target.value, technician]
                            }))} />

                            {/* Submit Button */}
                            <button
                                className="bg-green-600 text-white rounded hover:bg-green-700 flex items-center mx-auto py-2 px-15 mt-3"
                                onClick={() => {
                                    updateRequest(request.id); 
                                    window.scrollTo({ top: 0, behavior: "smooth" })}}
                            >
                                Confirm
                            </button>
                        </div>
                )})}
            </section>
        </div>
    );
}