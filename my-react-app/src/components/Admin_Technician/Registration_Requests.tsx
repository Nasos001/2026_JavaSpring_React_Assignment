// Imports 
// ========================================================================================================================================================
import { useState, useEffect } from 'react';

// Interfaces 
// ========================================================================================================================================================
interface User {
    id: number;
    name: string;
    surname: string;
    country: string;
    city: string;
    address: string;
    username: string;
    email: string;
    role: string;
}

// Main Component
// ========================================================================================================================================================
export default function Registration_Requests() {

    // States & Var 
    // --------------------------------------------------------------------------------------------------------------
    const [error, setError] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [success, setSuccess] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

    const [selectedRoles, setSelectedRoles] = useState<Record<number, string>>({});
    const roles = ["ADMIN", "TECHNICIAN", "USER", "NOT_DETERMINED"];

    // Retrieve unRegistered Users 
    // --------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Make fetch
                const res = await fetch("http://localhost:8080/api/users?role=NOT_DETERMINED", {credentials: "include"});

                // Check for Error
                if (!res.ok) {
                    const msg = await res.text();
                    throw new Error("Error when getting non_defined users" + msg);
                }

                // Get data
                const data: User[] = await res.json();
                setUsers(data);

                // Initialize role map
                const initialRoles: Record<number, string> = {};
                data.forEach(user => {
                    initialRoles[user.id] = user.role;
                });
                setSelectedRoles(initialRoles);
            } catch(error) {
                console.error(error);
                setError(true);
            }
        }

        fetchUsers();
    }, [])

    // Handle Role Change 
    // --------------------------------------------------------------------------------------------------------------
    async function updateRole(id: number) {
        // Get Role for the corresponding User
        const role = selectedRoles[id];

        try {
            // Make fetch
            const res = await fetch("http://localhost:8080/api/users/role", {
                method: "PUT", 
                credentials: "include", 
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify({id: id, role: role})
            });

            // Handle Result
            if (res.ok) {
                setSuccess("Role has been updated!");

                // Remove User from the UI List
                setUsers(prev => prev.filter(user => user.id !== id));
            } else {
                const msg = await res.text();
                throw new Error("Error when updating role:" + msg);
            }
        } catch(error) {
            console.error(error);
            setError(true);
            setSuccess(null);
        }
    }

    // Handle Delete
    // --------------------------------------------------------------------------------------------------------------
    async function rejectRequest(id: number) {
        try {
            // Make fetch
            const res = await fetch(`http://localhost:8080/api/users/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            
            // Check Response
            if (res.ok) {
                // Remove the user from the list
                setUsers(prev => prev.filter(user => user.id !== id));
                setSuccess("User has been deleted");
            } else {
                const msg = await res.text();
                throw new Error("Error when deleting user:" + msg);
            }
        } catch(error) {
            console.error(error);
            setError(true);
            setSuccess(null);
        }
    }

    // JSX 
    // --------------------------------------------------------------------------------------------------------------
    return(
        <div className="min-h-screen bg-white">
            {/* Header */}
            <p className="mt-10 h-15 text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                Pending Registrations
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

                {/* Display Users */}
                {users.length > 0 ? users.map((user) => (
                    <div key={user.id} className="border-b-blue-800 bg-blue-200 rounded p-4 mb-4">
                        {/* Details */}
                        <p className="font-semibold">ID: <span className='font-normal'>{user.id}</span></p>
                        <p className="font-semibold">Name: <span className='font-normal'>{user.name} {" "} {user.surname}</span></p>
                        <p className="font-semibold">Location: <span className='font-normal'>{user.country} {" "} {user.city} {" "} {user.address}</span></p>
                        <p className="font-semibold">Username: <span className='font-normal'>{user.username}</span></p>
                        <p className="font-semibold">Email: <span className='font-normal'>{user.email}</span></p>

                        {/* Role Dropdown */}
                        <br/>Role:
                        <select
                            value={selectedRoles[user.id]}
                            onChange={(e) => {
                                setSelectedRoles(prev => ({
                                ...prev,
                                [user.id]: e.target.value
                                }));
                                setError(false);
                                setSuccess(null);
                            }}
                        >
                            {roles.map(role => (
                                <option value={role}>{role}</option>
                            ))}
                        </select>
                        
                        {/* Options */}
                        <div className='grid grid-cols-2'>
                            <button
                                onClick={() => {updateRole(user.id); window.scrollTo({ top: 0, behavior: "smooth" })}}
                                disabled={!selectedRoles[user.id] || selectedRoles[user.id] === user.role}
                            >
                                Confirm
                            </button>


                            <button onClick={() => setConfirmDelete({ id: user.id ?? 0, name: user.name ?? ""})}>
                                Reject
                            </button>
                        </div>
                        
                    </div>
                )) : (
                    <p className={"h-96 max-w-3/4 rounded-lg m-auto p-3 mb-5 bg-blue-200 font-bold text-2xl flex items-center justify-center"}>
                        You have no active requests
                    </p>
                )}

                {confirmDelete && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-md w-96">
                            <p className="mb-4 text-lg font-semibold">
                                Are you sure you want to reject {confirmDelete.name}'s Registration?
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    className="bg-gray-300 py-1 px-4 rounded hover:bg-gray-400"
                                    onClick={() => setConfirmDelete(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-red-600 text-white py-1 px-4 rounded hover:bg-red-700"
                                    onClick={() => {
                                        rejectRequest(confirmDelete.id);
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                        setConfirmDelete(null);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section> 
        </div>
    );
}