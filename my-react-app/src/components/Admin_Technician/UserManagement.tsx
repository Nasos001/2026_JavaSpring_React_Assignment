import { useState, useEffect, useMemo } from 'react';
import { Menu, Plus, X } from 'lucide-react';

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

export default function UserManagement() {
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    const roles = ["ADMIN", "TECHNICIAN", "USER", "NOT_DETERMINED"];
    const [search, setSearch] = useState<number>(0);
    const [error, setError] = useState(false);
    const [user, setUser] = useState<Partial<User>>({});
    const [password, setPassword] = useState("");
    const [newUser, setNewUser] = useState<Partial<User>>({});
    const [success, setSuccess] = useState<boolean | null>(null);
    const [openNew, setOpenNew] = useState(false);
    const [loading, setLoading] = useState(false);
    const [countriesData, setCountriesData] = useState<Countries[]>([]);
    const [countries, setCountries] = useState<string[]>([]);

    // Cities for NEW user form
    const cities = useMemo(() => {
        if (!newUser.country) return [];
        const selectedCountry = countriesData.find(c => c.country === newUser.country);
        return selectedCountry?.cities ?? [];
    }, [newUser.country, countriesData]);

    // Cities for EDIT user form (FIX #2)
    const editCities = useMemo(() => {
        if (!user.country) return [];
        const selectedCountry = countriesData.find(c => c.country === user.country);
        return selectedCountry?.cities ?? [];
    }, [user.country, countriesData]);

    useEffect(() => {
        const fetchCountriesAndCities = async () => {
            const res = await fetch("https://countriesnow.space/api/v0.1/countries");
            const data = await res.json() as CountriesAndCities;
            setCountriesData(data.data);
            setCountries(data.data.map(c => c.country));
        };
        fetchCountriesAndCities();
    }, []);

    const fetchUser = async () => {
        const res = await fetch(`http://localhost:8080/api/users?id=${search}`, {credentials: "include"});
        if (!res.ok) return setError(true);
        const data: User[] = await res.json();
        setUser(data[0]);
    };

    async function createUser(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
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

        if (res.ok) {
            setSuccess(true);
            setLoading(false);
        } else {
            setError(true);
        }
    }

    async function updateUser(id: number) {
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

        if (res.ok) {
            setSuccess(true);
        } else {
            setError(true);
        }
    }

    async function deleteUser(id: number) {
        const res = await fetch(`http://localhost:8080/api/users/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        
        if (res.ok) {
            setUser({});
            setSuccess(true);
        } else {
            setError(true);
        }
    }

    function handleUserChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setUser(prev => ({...prev, [name]: value}));
    }

    function handleNewUserChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setNewUser(prev => ({...prev, [name]: value}));
    }

    return (
        <div className="min-h-screen bg-white">
            <nav className="bg-white shadow-sm sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <span className="text-3xl font-bold text-blue-600">MiHelper</span>
                    <div className="hidden md:flex items-center gap-8">
                        <a className="text-gray-700 hover:text-blue-600 transition-colors font-medium cursor-pointer">Home</a>
                        <a className="text-gray-700 hover:text-blue-600 transition-colors font-medium cursor-pointer">New Request</a>
                        <a className="text-gray-700 hover:text-blue-600 transition-colors font-medium cursor-pointer">Monitor</a>
                        <a className="text-gray-700 hover:text-blue-600 transition-colors font-medium cursor-pointer">History</a>
                    </div>
                    <div className="md:hidden">
                        <button className="text-gray-700 hover:text-blue-600 p-2" onClick={() => setHamburgerOpen(!hamburgerOpen)}>
                            {hamburgerOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            <p className="h-20 mt-10 text-5xl font-bold text-blue-600 text-center">User Management</p>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-22">
                {error && <p className="rounded-lg mx-auto p-3 text-lg mb-5 bg-red-300">An error occurred. Please try again.</p>}
                {success && <p className="rounded-lg mx-auto p-3 text-lg mb-5 bg-green-300">Success!</p>}

                {!openNew ? (
                    <div className="bg-blue-300 rounded p-4 mb-4 flex gap-5 hover:cursor-pointer" onClick={() => setOpenNew(true)}>
                        <Plus /> Register New User
                    </div>
                ) : (
                    <div className="bg-blue-200 rounded p-4 mb-4">
                        <form onSubmit={createUser} className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
                            <input className="border-gray-500 border rounded w-full p-0.5" name="name" value={newUser.name} onChange={handleNewUserChange} required />

                            <label className="block text-sm font-medium text-gray-700 mb-1">Surname:</label>
                            <input className="border-gray-500 border rounded w-full p-0.5" name="surname" value={newUser.surname} onChange={handleNewUserChange} required />

                            <label className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
                            <input className="border-gray-500 border rounded w-full p-0.5" name="username" value={newUser.username} onChange={handleNewUserChange} required />

                            <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                            <input className="border-gray-500 border rounded w-full p-0.5" name="email" type="email" value={newUser.email} onChange={handleNewUserChange} required />

                            <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
                            <input className="border-gray-500 border rounded w-full p-0.5" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                            <div className="grid grid-cols-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country:</label>
                                <select className="border border-gray-500 rounded" name="country" value={newUser.country} onChange={handleNewUserChange} required>
                                    <option value="">Select a country</option>
                                    {countries.map((country) => <option key={country} value={country}>{country}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">City:</label>
                                <select className="border border-gray-500 rounded" name="city" value={newUser.city} onChange={handleNewUserChange} disabled={!newUser.country} required>
                                    {cities.length > 0 && <option value="">Select a city</option>}
                                    {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                                </select>
                            </div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">Address:</label>
                            <input className="border-gray-500 border rounded w-full p-0.5" name="address" value={newUser.address} onChange={handleNewUserChange} required />

                            <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 py-2.5 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
                                {loading ? "Creating account..." : "Register"}
                            </button>

                            <button type="button" onClick={() => setOpenNew(false)} disabled={loading} className="w-full rounded-lg bg-red-600 py-2.5 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-50">
                                Discard
                            </button>
                        </form>
                    </div>
                )}

                {/* FIX #3: Add type="button" to prevent form submission */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <input type="number" className="border border-gray-500 rounded p-2" value={search} onChange={(e) => setSearch(Number(e.target.value))} />
                    <button type="button" className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700" onClick={() => fetchUser()}>
                        Search
                    </button>
                </div>

                {user.id && (
                    <div className="bg-blue-200 rounded p-4 mb-4">
                        {/* FIX #1: Added name attributes */}
                        <p className="font-semibold">Name:</p>
                        <input type="text" name="name" value={user.name ?? ""} className="border border-gray-500 rounded w-full p-1 mb-2" onChange={handleUserChange} />

                        <p className="font-semibold">Surname:</p>
                        <input type="text" name="surname" value={user.surname ?? ""} className="border border-gray-500 rounded w-full p-1 mb-2" onChange={handleUserChange} />

                        <div className="grid grid-cols-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country:</label>
                            <select className="border border-gray-500 rounded" name="country" value={user.country} onChange={handleUserChange} required>
                                <option value="">Select a country</option>
                                {countries.map((country) => <option key={country} value={country}>{country}</option>)}
                            </select>
                        </div>

                        {/* FIX #5: Use editCities instead of cities */}
                        <div className="grid grid-cols-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">City:</label>
                            <select className="border border-gray-500 rounded" name="city" value={user.city} onChange={handleUserChange} disabled={!user.country} required>
                                {editCities.length > 0 && <option value="">Select a city</option>}
                                {editCities.map((city) => <option key={city} value={city}>{city}</option>)}
                            </select>
                        </div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">Address:</label>
                        <input className="border-gray-500 border rounded w-full p-0.5" name="address" value={user.address} onChange={handleUserChange} required />

                        <label className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
                        <input className="border-gray-500 border rounded w-full p-0.5" name="username" value={user.username} onChange={handleUserChange} required />

                        {/* FIX #4: Added name attribute */}
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role:</label>
                        <select className="border border-gray-500 rounded w-full p-1 mb-2" name="role" value={user.role} onChange={handleUserChange}>
                            {roles.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>

                        <div className="grid grid-cols-2 gap-2">
                            <button className="bg-green-600 text-white rounded p-2 hover:bg-green-700" onClick={() => updateUser(user.id!)}>
                                Confirm
                            </button>
                            <button className="bg-red-600 text-white rounded p-2 hover:bg-red-700" onClick={() => deleteUser(user.id!)}>
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}