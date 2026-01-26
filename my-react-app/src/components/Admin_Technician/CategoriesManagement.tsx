// Imports =============================================================================================================================
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Menu, Plus, X } from 'lucide-react';

// Interfaces ==========================================================================================================================
interface Category {
    id: number;
    name: string;
    description: string;
    priority: string;
}


export default function CategoriesManagement() {
    
    // Check User Authorization ----------------------------------------------------------------
    const navigate = useNavigate();
    useEffect(() => {
        fetch("http://localhost:8080/api/auth/check", {credentials: "include"})
        .then((res) => {
            if (res.status === 401) {
                navigate("/login");
            }
        })
        .catch((err) => {
            console.error(err);
        })
    }, [navigate]);

    // States & Var ----------------------------------------------------------------------------
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    const [error, setError] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [openNew, setOpenNew] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");

    const [selectedCategories, setSelectedCategories] = useState<Record<number, [string, string, string]>>({});
    const priorities = ["LOW", "MEDIUM", "HIGH"];

    // Retrieve unRegistered Users -------------------------------------------------------------
    useEffect(() => {
        const fetchUsers = async () => {
            // Make fetch
            const res = await fetch("http://localhost:8080/api/categories", {credentials: "include"});

            // Check for Error
            if (!res.ok) return setError(true);

            // Get data
            const data: Category[] = await res.json();
            setCategories(data);

            // Initialize Categories map
            const initialCategories: Record<number, [string, string, string]> = {};
            data.forEach(category => {
                initialCategories[category.id] = [category.name, category.description, category.priority];
            });
            setSelectedCategories(initialCategories);
        }

        fetchUsers();
    }, [])

    // Create Category ---------------------------------------------------------------------
    async function createCategory() {
        // Make fetch
        const res = await fetch("http://localhost:8080/api/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({id: 0, name: name, description: description, priority: priority})
        });

        // Check Response
        if (res.ok) {
            setSuccess(true);
        } else {
            setError(true);
        }
    }

    // Update Category ----------------------------------------------------------------------
    async function updateCategory(id: number) {
        // Get Category inputs
        const [name, description, priority] = selectedCategories[id];

        // Make fetch
        const res = await fetch("http://localhost:8080/api/categories", {
            method: "PUT", 
            credentials: "include", 
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({id: id, name: name, description: description, priority: priority})
        });

        // Handle Result
        if (res.ok) {
            setSuccess(true);
        } else {
            setError(true);
        }
    }

    // Handle Delete ---------------------------------------------------------------------------
    async function deleteCategory(id: number) {
        // Make fetch
        const res = await fetch(`http://localhost:8080/api/categories/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        
        if (res.ok) {
            // Remove the category from the list
            setCategories(prev => prev.filter(category => category.id !== id));
            setSuccess(true);
        } else {
            setError(true);
        }
    }

    // JSX --------------------------------------------------------------------------------------
    return(
        <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white shadow-sm sticky top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            
                {/* Logo */}
                <span className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    MiHelper
                </span>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <a className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                    onClick={() => navigate("/adminHome")}
                    >
                    Home
                    </a>
                    <a className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                    onClick={() => navigate("/New Request")}
                    >
                    New Request
                    </a>
                    <a className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                    onClick={() => navigate("/monitor")}
                    >
                    Monitor
                    </a>
                    <a className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        onClick={() => navigate("/history")}
                    >
                        History
                    </a>
                    <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Announcements
                    </a>
                    <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Features
                    </a>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button className="text-gray-700 hover:text-blue-600 p-2"
                        onClick={() => setHamburgerOpen(!hamburgerOpen)}
                    >
                    {hamburgerOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            
            </div>

            {/* Mobile Navigation */}
            {hamburgerOpen && (
            <div className="md:hidden bg-white border-t">
                <div className="px-2 pt-2 pb-3 space-y-1">
                <a className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
                    href="#about"
                >
                    New Request
                </a>
                <a className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
                    href="#about"
                >
                    Monitor
                </a>
                <a className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
                    href="#about"
                >
                    History
                </a>
                <a className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
                    href="#about"
                >
                    Announcements
                </a>
                <a className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
                    href="#features"
                >
                    Features
                </a>

                <a className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
                    href="#about"
                >
                    About
                </a>
                </div>
            </div>
            )}
        </nav>

        <p className="h-20 mt-10 text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            Categories
        </p>

        {/* Main Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-22">

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

            {!openNew ? 
            <div className="border-b-blue-800 bg-blue-300 rounded p-4 mb-4 flex flex-1 gap-5 hover:cursor-pointer"
                onClick={() => setOpenNew(true)}
            >
                <Plus/> Create New Category
            </div>
            :
            <div className="border-b-blue-800 bg-blue-200 rounded p-4 mb-4">

                        {/* Name */}
                        <p className="font-semibold">Name:</p>
                        <input
                            type="text"
                            value={name}
                            className="border border-gray-500 rounded w-full p-1 mb-2"
                            onChange={(e) => setName(e.target.value)}
                        />

                        {/* Description */}
                        <p className="font-semibold">Description:</p>
                        <input
                            type="text"
                            value={description}
                            className="border border-gray-500 rounded w-full p-1 mb-2"
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        {/* Priority */}
                        <p className="font-semibold">Priority:</p>
                        <select
                            value={priority}
                            className="border border-gray-500 rounded w-full p-1 mb-2"
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            {priorities.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>

                        <div className='grid grid-cols-2 gap-2'>
                            <button
                                className="bg-green-600 text-white py-1 rounded hover:bg-green-700"
                                onClick={() => createCategory()}
                            >
                                Create
                            </button>

                            <button
                                className="bg-red-600 text-white py-1 rounded hover:bg-red-700"
                                onClick={() => setOpenNew(false)}
                            >
                                Discard
                            </button>
                        </div>
                    </div>
            }

            {categories.length > 0 ? categories.map((category) => {
                const [name, description, priority] = selectedCategories[category.id] || ["", "", ""];

                return (
                    <div key={category.id} className="border-b-blue-800 bg-blue-200 rounded p-4 mb-4">
                        <p className="font-semibold">ID: <span className='font-normal'>{category.id}</span></p>

                        {/* Editable Name */}
                        <p className="font-semibold">Name:</p>
                        <input
                            type="text"
                            value={name}
                            className="border border-gray-500 rounded w-full p-1 mb-2"
                            onChange={(e) => setSelectedCategories(prev => ({
                                ...prev,
                                [category.id]: [e.target.value, description, priority]
                            }))}
                        />

                        {/* Editable Description */}
                        <p className="font-semibold">Description:</p>
                        <input
                            type="text"
                            value={description}
                            className="border border-gray-500 rounded w-full p-1 mb-2"
                            onChange={(e) => setSelectedCategories(prev => ({
                                ...prev,
                                [category.id]: [name, e.target.value, priority]
                            }))}
                        />

                        {/* Editable Priority */}
                        <p className="font-semibold">Priority:</p>
                        <select
                            value={priority}
                            className="border border-gray-500 rounded w-full p-1 mb-2"
                            onChange={(e) => setSelectedCategories(prev => ({
                                ...prev,
                                [category.id]: [name, description, e.target.value]
                            }))}
                        >
                            {priorities.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>

                        <div className='grid grid-cols-2 gap-2'>
                            <button
                                className="bg-green-600 text-white py-1 rounded hover:bg-green-700"
                                onClick={() => updateCategory(category.id)}
                            >
                                Confirm
                            </button>

                            <button
                                className="bg-red-600 text-white py-1 rounded hover:bg-red-700"
                                onClick={() => deleteCategory(category.id)}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                );
            }) : (
                <p className={"h-96 max-w-3/4 rounded-lg m-auto p-3 mb-5 bg-blue-200 font-bold text-2xl flex items-center justify-center"}>
                    You have no active requests
                </p>
            )}

        </section>

        
    </div>
    );
}