// Imports 
// ========================================================================================================================================================
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

// Interfaces 
// ========================================================================================================================================================
interface Category {
    id: number;
    name: string;
    description: string;
    priority: string;
}

// Main Component
// ========================================================================================================================================================
export default function CategoriesManagement() {

    // States & Variables
    // ---------------------------------------------------------------------------------------------------------
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [openNew, setOpenNew] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Record<number, [string, string, string]>>({});

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");

    const priorities = ["LOW", "MEDIUM", "HIGH"];

    // Retrieve Categories 
    // ---------------------------------------------------------------------------------------------------------
    useEffect(() => {
        const fetchUsers = async () => {
            try {
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
            } catch(error) {
                console.error(error);
            }
        }

        fetchUsers();
    }, [])

    // Create Category ---------------------------------------------------------------------
    async function createCategory() {
        try {
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
        } catch(error) {
            console.error(error);
        }
        
    }

    // Update Category ----------------------------------------------------------------------
    async function updateCategory(id: number) {
        try {
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
        } catch(error) {
            console.error(error);
        }
    }

    // Handle Delete ---------------------------------------------------------------------------
    async function deleteCategory(id: number) {
        try {
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
        } catch(error) {
            console.error(error);
        }
    }

    // JSX --------------------------------------------------------------------------------------
    return(
        <div className="min-h-screen bg-white">
            {/* Header */}
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

                {/* Display Categories */}
                {categories.length > 0 ? categories.map((category) => {
                    {/* Get properties */}
                    const [name, description, priority] = selectedCategories[category.id] || ["", "", ""];

                    return (
                        <div key={category.id} className="border-b-blue-800 bg-blue-200 rounded p-4 mb-4">
                            <p className="font-semibold">ID: <span className='font-normal'>{category.id}</span></p>

                            {/* Name */}
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

                            {/* Description */}
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

                            {/* Priority */}
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

                            {/* Options */}
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