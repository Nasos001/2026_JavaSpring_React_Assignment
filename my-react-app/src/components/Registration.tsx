// Imports 
// ======================================================================================================================================================
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Interfaces 
// ======================================================================================================================================================
interface RegisterRequest {
  name: string;
  surname: string;
  country: string;
  city: string;
  address: string;
  username: string;
  email: string;
  password: string;
}

interface CountriesAndCities {
    error: string,
    msg: string,
    data: Countries[]
}

interface Countries {
    country: string,
    cities: string[]
}

// Main Component
// ======================================================================================================================================================
export default function Register() {

    // States & Variables
    // ---------------------------------------------------------------------------------------------------------------
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [countriesData, setCountriesData] = useState<Countries[]>([]);
    const [countries, setCountries] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [form, setForm] = useState<RegisterRequest>({
        name: "",
        surname: "",
        country: "",
        city: "",
        address: "",
        username: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    // Retrieve Countries and Cities
    // ---------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        const fetchCountriesAndCities = async () => {
            const res = await fetch("https://countriesnow.space/api/v0.1/countries");

            const data = await res.json() as CountriesAndCities;

            setCountriesData(data.data);
            setCountries(data.data.map(c => c.country));

        }

        fetchCountriesAndCities();
    }, [])

    // Handle Form Change 
    // ---------------------------------------------------------------------------------------------------------------
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };

    // Handle Country Change 
    // ---------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        if (!form.country) {
            setCities([]);
            return;
        }

        const selectedCountry = countriesData.find(
            c => c.country === form.country
        );

        setCities(selectedCountry?.cities ?? []);
    }, [form.country, countriesData]);


    // Handle Submit Form
    // ---------------------------------------------------------------------------------------------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
        // Make call
        const res = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        // Check Response
        if (!res.ok) {
            const msg = await res.text();
            throw new Error(msg || "Registration failed");
        }

        setSuccess(true);
        setTimeout(() => navigate("/login"), 4000);
        
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
        } finally {
        setLoading(false);
        }
    };

    // JSX 
    // ---------------------------------------------------------------------------------------------------------------
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            {/* Form */}
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm p-6">
                {/* Header */}
                <h2 className="text-2xl font-semibold text-center mb-6">
                Registration
                </h2>

                {/* Error Message, if any */}
                {error && (
                <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                    {error}
                </div>
                )}

                {/* Success Message */}
                {success && (
                <div className="mb-4 rounded-lg bg-green-500 p-3 text-sm">
                    Registration Complete! Redirecting to Login...
                </div>
                )}

                {/* Submission Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Name */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name:
                    </label>
                    <input className="border-gray-500 border rounded w-full p-0.5"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    />

                    {/* Surname */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Surname:
                    </label>
                    <input className="border-gray-500 border rounded w-full p-0.5"
                    name="surname"
                    value={form.surname}
                    onChange={handleChange}
                    required
                    />
                    
                    {/* Username */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username:
                    </label>
                    <input className="border-gray-500 border rounded w-full p-0.5"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />

                    {/* Email */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email:
                    </label>
                    <input className="border-gray-500 border rounded w-full p-0.5"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    {/* Password */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password:
                    </label>
                    <input className="border-gray-500 border rounded w-full p-0.5"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    {/* Country */}
                    <div className="grid grid-cols-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country:
                        </label>
                        <select className="border border-gray-500 rounded"
                            name="country"
                            value={form.country} 
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a country</option>
                            {countries.map((country) => (
                                <option value={country}>{country}</option>
                            ))}
                        </select>
                        
                    </div>
                    
                    {/* City */}
                    <div className="grid grid-cols-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        City:
                        </label>
                        <select className="border border-gray-500 rounded"
                            name="city"
                            value={form.city} 
                            onChange={handleChange}
                            disabled={!form.country}
                            required
                        >
                            { cities.length > 0 && <option value="">Select a city</option>}
                            {cities.map((city) => (
                                <option value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Address */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address:
                    </label>
                    <input className="border-gray-500 border rounded w-full p-0.5"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-2.5 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                    </form>

                    {/* Link to Login */}
                    <p className="mt-4 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-blue-600 hover:underline cursor-pointer hover:cursor-pointer"
                    >
                        Log in
                    </span>
                </p>
            </div>
        </div>
    );
}
