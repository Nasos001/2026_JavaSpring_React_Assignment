// Imports 
// ========================================================================================================================================================
import { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';


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

interface CountriesAndCities {
    error: string;
    msg: string;
    data: Countries[];
}

interface Countries {
    country: string;
    cities: string[];
}

// Main Component
// ========================================================================================================================================================
export default function UserManagement() {

    // States
    // ------------------------------------------------------------------------------------------------------------------
    const roles = ["ADMIN", "TECHNICIAN", "USER", "NOT_DETERMINED"];
    const [search, setSearch] = useState<number>(0);
    const [openNew, setOpenNew] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<Partial<User>>({});

    const [password, setPassword] = useState("");
    const [newUser, setNewUser] = useState<Partial<User>>({});

    const [success, setSuccess] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

    const [countriesData, setCountriesData] = useState<Countries[]>([]);
    const [countries, setCountries] = useState<string[]>([]);

    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

  const isFormValid = 
    newUser.name?.trim() &&
    newUser.surname?.trim() &&
    newUser.username?.trim() &&
    newUser.email?.trim() &&
    newUser.country &&
    newUser.city &&
    newUser.address &&
    password.trim();


    // Variables
    // ------------------------------------------------------------------------------------------------------------------

    // Cities for new User
    const cities = useMemo(() => {
        // Return [] if no country was selected
        if (!newUser.country) return [];

        // Get selected Country Info
        const selectedCountry = countriesData.find(c => c.country === newUser.country);

        // Get selected Country cities
        return selectedCountry?.cities ?? [];
    }, [newUser.country, countriesData]);

    // Cities for editable User
    const editCities = useMemo(() => {
        // Return [] if no country was selected
        if (!user.country) return [];

        // Get selected Country Info
        const selectedCountry = countriesData.find(c => c.country === user.country);

        // Get selected Country cities
        return selectedCountry?.cities ?? [];
    }, [user.country, countriesData]);

    // Get Countries and Cities
    // ------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        const fetchCountriesAndCities = async () => {
            try {
                // Make Fetch
                const res = await fetch("https://countriesnow.space/api/v0.1/countries");

                // Check Response
                if (!res.ok) throw new Error("Error when fetching countries and their cities");

                // Get data
                const data = await res.json() as CountriesAndCities;
                setCountriesData(data.data);
                setCountries(data.data.map(c => c.country));
            } catch(error) {
                console.error(error);
                setMessage({type: "error", text: "Countries and Cities could not be retrieved. Please try again later"});
            }
        };

        fetchCountriesAndCities();
    }, []);

    // Get Searched User
    // ------------------------------------------------------------------------------------------------------------------
    const fetchUser = async () => {
        try {
            // Make Fetch
            const res = await fetch(`http://localhost:8080/api/users?id=${search}`, {credentials: "include"});

            // Check Response
            if (!res.ok) throw new Error("Error when getting the User");

            // Get data
            const data: User[] = await res.json();
            setUser(data[0]);
        } catch(error) {
            console.error(error);
            setMessage({type: "error", text: "User doesn't exist"});
        }
    };

    // Create User
    // ------------------------------------------------------------------------------------------------------------------
    async function createUser(e: React.FormEvent) {
        // Indicate Loading
        e.preventDefault();
        setLoading(true);

        try {
            // Make fetch
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({
                    id: 0,
                    name: newUser?.name,
                    surname: newUser?.surname,
                    country: newUser?.country,
                    city: newUser?.city,
                    address: newUser?.address,
                    username: newUser?.username,
                    email: newUser?.email,
                    password: password
                })
            });

            // Check Response
            if (res.ok) {
                setMessage(null);
                setSuccess("Successfully registered the User!");
            } else {
                throw new Error("Error when creating a user");
            }
        } catch(error) {
            console.error(error);
            setMessage({type: "error", text: "Registration failed. Please try again later"});
        } finally {
            setLoading(false);
        }
    }

    // Update User
    // ------------------------------------------------------------------------------------------------------------------
    async function updateUser(id: number) {
        
        try {
            // Make fetch
            const res = await fetch("http://localhost:8080/api/users/user", {
                method: "PUT",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    id: id,
                    name: user?.name,
                    surname: user?.surname,
                    country: user?.country,
                    city: user?.city,
                    address: user?.address,
                    username: user?.username,
                    email: user?.email,
                    role: user?.role
                })
            });

            // Check Response
            if (res.ok) {
                setMessage(null);
                setSuccess("Successfully updated the User's information!");
            } else {
                throw new Error("Error when updating the User");
            }
        } catch(error) {
            console.error(error);
            setMessage({type: "error", text: "Update failed. Please try again later."});
        }
    }

    // Delete User
    // ------------------------------------------------------------------------------------------------------------------
    async function deleteUser(id: number) {
        try {
            // Make fetch
            const res = await fetch(`http://localhost:8080/api/users/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            
            // Check Response
            if (res.ok) {
                setUser({});
                setMessage(null);
                setSuccess("Successfully deleted the User!");
            } else {
                const msg = await res.text();
                throw new Error("Error when deleting the User:"+ msg);
            }
        } catch(error) {
            console.error(error);
            setMessage({type: "error", text: "Deletion failed. Please try again later."});
        }
    }

    // Handle User Change
    // ------------------------------------------------------------------------------------------------------------------
    function handleUserChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setUser(prev => ({...prev, [name]: value}));
    }

    //Handle New User Change
    // ------------------------------------------------------------------------------------------------------------------
    function handleNewUserChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setNewUser(prev => ({...prev, [name]: value}));
    }

    // JSX
    // ------------------------------------------------------------------------------------------------------------------
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <p className="h-20 mt-10 text-5xl font-bold text-blue-600 text-center">User Management</p>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-22">

                {/* Error Message */}
                { message && 
                <p className={`max-w-3/4 rounded-lg mx-auto p-3 text-lg mb-5 ${message.type === 'success' ? 'bg-green-300' : 'bg-red-300'}`}>
                    {message.text}
                </p>
                }

                {/* Success Message */}
                {success && <p className="rounded-lg mx-auto p-3 text-lg mb-5 bg-green-300">{success}</p>}

                {/* Create New User */}
                {!openNew ? (
                    <div className="bg-blue-300 rounded p-4 mb-4 flex gap-5 hover:cursor-pointer" onClick={() => setOpenNew(true)}>
                        <Plus /> Register New User
                    </div>
                ) : (
                    <div className="bg-blue-200 rounded p-4 mb-4">
                        <form onSubmit={createUser} className="space-y-4">
                            {/* Name */}
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
                            <input className="border-gray-500 border rounded w-full p-0.5" name="name" value={newUser.name} onChange={handleNewUserChange} required />

                            {/* Surname */}
                            <label className="block text-sm font-medium text-gray-700 mb-1">Surname:</label>
                            <input className="border-gray-500 border rounded w-full p-0.5" name="surname" value={newUser.surname} onChange={handleNewUserChange} required />

                            {/* Username */}
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
                            <input className="border-gray-500 border rounded w-full p-0.5" name="username" value={newUser.username} onChange={handleNewUserChange} required />

                            {/* Email */}
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                            <input className="border-gray-500 border rounded w-full p-0.5" name="email" type="email" value={newUser.email} onChange={handleNewUserChange} required />

                            {/* Password */}
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
                            <input className="border-gray-500 border rounded w-full p-0.5" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                            {/* Country */}
                            <div className="grid grid-cols-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country:</label>
                                <select className="border border-gray-500 rounded" name="country" value={newUser.country} onChange={handleNewUserChange} required>
                                    <option value="">Select a country</option>
                                    {countries.map((country) => <option key={country} value={country}>{country}</option>)}
                                </select>
                            </div>

                            {/* City */}
                            <div className="grid grid-cols-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">City:</label>
                                <select className="border border-gray-500 rounded" name="city" value={newUser.city} onChange={handleNewUserChange} disabled={!newUser.country} required>
                                    {cities.length > 0 && <option value="">Select a city</option>}
                                    {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                                </select>
                            </div>

                            {/* Address */}
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address:</label>
                            <input className="border-gray-500 border rounded w-full p-0.5" name="address" value={newUser.address} onChange={handleNewUserChange} required />

                            {/* Submit Button */}
                            <button type="submit" disabled={loading || !isFormValid} className="w-full rounded-lg bg-blue-600 py-2.5 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
                                {loading ? "Creating account..." : "Register"}
                            </button>

                            {/* Discard Button */}
                            <button type="button" onClick={() => setOpenNew(false)} disabled={loading} className="w-full rounded-lg bg-red-600 py-2.5 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-50">
                                Discard
                            </button>
                        </form>
                    </div>
                )}

                {/* Search Form */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <input type="number" className="border border-gray-500 rounded p-2" value={search} onChange={(e) => {setSearch(Number(e.target.value)); setMessage(null)}} />
                    <button type="button" className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700" onClick={() => {fetchUser(); setUser({}); setMessage(null); setSuccess(null)}}>
                        Search
                    </button>
                </div>

                {/* Render Retrieved User */}
                {user.id && (
                    <div className="bg-blue-200 rounded p-4 mb-4">
                        {/* Name */}
                        <p className="font-semibold">Name:</p>
                        <input type="text" name="name" value={user.name ?? ""} className="border border-gray-500 rounded w-full p-1 mb-2" onChange={handleUserChange} />

                        {/* Surname */}
                        <p className="font-semibold">Surname:</p>
                        <input type="text" name="surname" value={user.surname ?? ""} className="border border-gray-500 rounded w-full p-1 mb-2" onChange={handleUserChange} />

                        {/* Country */}
                        <div className="grid grid-cols-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country:</label>
                            <select className="border border-gray-500 rounded" name="country" value={user.country} onChange={handleUserChange} required>
                                <option value="">Select a country</option>
                                {countries.map((country) => <option key={country} value={country}>{country}</option>)}
                            </select>
                        </div>

                        {/* City */}
                        <div className="grid grid-cols-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">City:</label>
                            <select className="border border-gray-500 rounded" name="city" value={user.city} onChange={handleUserChange} disabled={!user.country} required>
                                {editCities.length > 0 && <option value="">Select a city</option>}
                                {editCities.map((city) => <option key={city} value={city}>{city}</option>)}
                            </select>
                        </div>

                        {/* Address */}
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address:</label>
                        <input className="border-gray-500 border rounded w-full p-0.5" name="address" value={user.address} onChange={handleUserChange} required />

                        {/* Username */}
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
                        <input className="border-gray-500 border rounded w-full p-0.5" name="username" value={user.username} onChange={handleUserChange} required />

                        {/* Role */}
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role:</label>
                        <select className="border border-gray-500 rounded w-full p-1 mb-2" name="role" value={user.role} onChange={handleUserChange}>
                            {roles.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>

                        {/* Options */}
                        <div className="grid grid-cols-2 gap-2">
                            <button className="bg-green-600 text-white rounded p-2 hover:bg-green-700" onClick={() => {
                                updateUser(user.id!); 
                                window.scrollTo({ top: 0, behavior: "smooth" })}}
                            >
                                Update
                            </button>
                            <button className="bg-red-600 text-white rounded p-2 hover:bg-red-700" onClick={() => 
                                setConfirmDelete({ id: user.id ?? 0, name: user.name ?? ""})}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}

                {confirmDelete && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-md w-96">
                            <p className="mb-4 text-lg font-semibold">
                                Are you sure you want to delete {confirmDelete.name}?
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
                                        deleteUser(confirmDelete.id);
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