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
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [openNew, setOpenNew] = useState(false);

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Record<number, [string, string, string]>>({});

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("LOW");

    const priorities = ["LOW", "MEDIUM", "HIGH"];
    const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);


    // Retrieve Categories 
    // ---------------------------------------------------------------------------------------------------------
    useEffect(() => {
        const fetchCategories = async () => {

            setLoading(true);

            try {
                // Make fetch
                const res = await fetch("http://localhost:8080/api/categories", {credentials: "include"});

                // Check for Error
                if (!res.ok) {
                    const msg = await res.text();
                    throw new Error("Error occurred when fetching categories:" + msg);
                };

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
                setSuccess(null);
                setError("Categories could not be retrieved");
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, [])

    // Create Category 
    // ---------------------------------------------------------------------------------------------------------
    async function createCategory() {

        // Check fields
        if (!name || !description || !priority) {
            setError("Please complete the form");
            return;
        }

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
            if (!res.ok) {
                const msg = await res.text();
                throw new Error("Error occurred when creating the category:" + msg);
            }

            // Get the created category
            const newCategory: Category = await res.json();
            
            // Add to categories list
            setCategories(prev => [...prev, newCategory]);

            
            // Add to selectedCategories map
            setSelectedCategories(prev => ({
                ...prev,
                [newCategory.id]: [newCategory.name, newCategory.description, newCategory.priority]
            }));


            // Reset form
            setName("");
            setDescription("");
            setPriority("LOW");
            setOpenNew(false);


            // Indicate Success
            setSuccess("Successfully created the Category!");
            setError(null);

        } catch(error) {
            console.error(error);
            setSuccess(null);
            setError("An error occurred when creating the Category.");
        }
    }

    // Update Category 
    // ---------------------------------------------------------------------------------------------------------
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
                setSuccess("Successfully updated the Category!");
            } else {
                const msg = await res.text();
                throw new Error("Error occurred when updating the category:" + msg);
            }
        } catch(error) {
            console.error(error);
            setSuccess(null);
            setError("An error occurred when updating the category.");
        }
    }

    // Delete Category 
    // ---------------------------------------------------------------------------------------------------------
    async function deleteCategory(id: number) {
        try {
            // Make fetch
            const res = await fetch(`http://localhost:8080/api/categories/${id}`, {
            method: "DELETE",
            credentials: "include",
            });

            // Check Result
            if (res.ok) {
                setCategories(prev => prev.filter(c => c.id !== id));
                setSuccess("Successfully Deleted the Category!");
            } else {
                const msg = await res.text();
                throw new Error(msg || "Error deleting category. It might be in use by a Request.");
            }
        } catch (err) {
            console.error(err);
            setSuccess(null);
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    }


    // JSX 
    // ---------------------------------------------------------------------------------------------------------
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
                        {error}
                    </p>
                }

                {/* Show Success, if any */}
                { success && 
                    <p className="max-w-3/4 rounded-lg mx-auto p-3 text-lg mb-5 bg-green-300">
                        {success}
                    </p>
                }

                {/* Show Action */}
                { loading && <p className="text-center">Loading Categories...</p> }

                {/* Inform in case of no results */}
                { !loading && !error && categories.length === 0 && (
                    <p className={"h-96 max-w-3/4 rounded-lg m-auto p-3 mb-5 bg-blue-200 font-bold text-2xl flex items-center justify-center"}>
                        There are no categories
                    </p>
                )}

                {/* Create a Category Section */}
                {!openNew ? 
                <div className="border-b-blue-800 bg-blue-400 rounded p-4 mb-4 flex flex-1 gap-5 hover:cursor-pointer"
                    onClick={() => setOpenNew(true)}
                >
                    <Plus/> Create New Category
                </div>
                :
                <div className="border-b-blue-800 bg-blue-400 rounded p-4 mb-4">

                            {/* Name */}
                            <p className="font-semibold">Name:</p>
                            <input
                                type="text"
                                value={name}
                                className="border border-gray-500 rounded w-full p-1 mb-2"
                                onChange={(e) => {setName(e.target.value); setError(null)}}
                            />

                            {/* Description */}
                            <p className="font-semibold">Description:</p>
                            <input
                                type="text"
                                value={description}
                                className="border border-gray-500 rounded w-full p-1 mb-2"
                                onChange={(e) => {setDescription(e.target.value); setError(null)}}
                            />

                            {/* Priority */}
                            <p className="font-semibold">Priority:</p>
                            <select
                                value={priority}
                                className="border border-gray-500 rounded w-full p-1 mb-2"
                                onChange={(e) => {setPriority(e.target.value); setError(null)}}
                            >
                                {priorities.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>

                            <div className='grid grid-cols-2 gap-2'>
                                <button
                                    className="bg-green-600 text-white py-1 rounded hover:bg-green-700"
                                    onClick={() => {createCategory(); setError(null)}}
                                >
                                    Create
                                </button>

                                <button
                                    className="bg-red-600 text-white py-1 rounded hover:bg-red-700"
                                    onClick={() => {setOpenNew(false); setError(null)}}
                                >
                                    Discard
                                </button>
                            </div>
                        </div>
                }

                {/* Display Categories */}
                {categories.length > 0 && categories.map((category) => {
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
                                onChange={(e) => {setSelectedCategories(prev => ({
                                    ...prev,
                                    [category.id]: [e.target.value, description, priority]
                                })); setError(null)}}
                            />

                            {/* Description */}
                            <p className="font-semibold">Description:</p>
                            <input
                                type="text"
                                value={description}
                                className="border border-gray-500 rounded w-full p-1 mb-2"
                                onChange={(e) => {setSelectedCategories(prev => ({
                                    ...prev,
                                    [category.id]: [name, e.target.value, priority]
                                })); setError(null)}}
                            />

                            {/* Priority */}
                            <p className="font-semibold">Priority:</p>
                            <select
                                value={priority}
                                className="border border-gray-500 rounded w-full p-1 mb-2"
                                onChange={(e) => {setSelectedCategories(prev => ({
                                    ...prev,
                                    [category.id]: [name, description, e.target.value]
                                })); setError(null)}}
                            >
                                {priorities.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>

                            {/* Options */}
                            <div className='grid grid-cols-2 gap-2'>
                                <button
                                    className="bg-green-600 text-white py-1 rounded hover:bg-green-700"
                                    onClick={() => {
                                        updateCategory(category.id); 
                                        setError(null); 
                                        window.scrollTo({ top: 0, behavior: "smooth" })}}
                                >
                                    Update
                                </button>

                                <button
                                    className="bg-red-600 text-white py-1 rounded hover:bg-red-700"
                                    onClick={() => {setConfirmDelete({ id: category.id, name: category.name })
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Confirmation Window */}
                {confirmDelete && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-md w-96">
                            <p className="mb-4 text-lg font-semibold">
                                Are you sure you want to delete "{confirmDelete.name}"?
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
                                        deleteCategory(confirmDelete.id);
                                        window.scrollTo({ top: 0, behavior: "smooth" })
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