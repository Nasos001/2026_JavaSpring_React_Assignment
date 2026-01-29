// Imports 
// ====================================================================================================================================================
import { useState, useEffect } from 'react';

// Interfaces 
// ====================================================================================================================================================
interface Category {
  id: number;
  name: string;
  description: string;
}

// Main Component 
// ====================================================================================================================================================
export default function NewRequest() {

  // States & Var
  // ----------------------------------------------------------------------------------------------------------
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [description, setDescription] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);


  // Retrieve Categories 
  // ----------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchCategories = async () => {
        try {
            // Make fetch
            const result = await fetch("http://localhost:8080/api/categories", {credentials: "include"});

            // Check result
            if (!result.ok) throw new Error("Failed to fetch categories");

            // Get data
            const data: Category[] = await result.json();
            setCategories(data);
            setSelectedCategory(data[0]?.id ?? null);
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Something went wrong, please try again." });
        }
    }

    fetchCategories();
  }, []);

  // Handle Submit
  // ----------------------------------------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check Description 
    if (!description.trim()) {
      setMessage({ type: "error", text: "Description is required." });
      return;
    }

    // Check Category
    if (!selectedCategory) return;

    // Create Form
    const formData = new FormData();
    formData.append("categoryId", String(selectedCategory));
    formData.append("description", description);
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      // Send Data
      const res = await fetch("http://localhost:8080/api/requests", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      // Set result
      setMessage( !res.ok ? { type: "error", text: "Something went wrong, please try again." } : { type: "success", text: "Your request has been submitted!" });
    } catch(error) {
      console.error(error);
      setMessage({ type: "error", text: "Something went wrong, please try again." });
    }
  } 

  // JSX 
  // ----------------------------------------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white">
      {/* Main Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 mt-20 bg-cyan-600 rounded-xl shadow-xl">
        <form className="text-center">
            {/* Header */}
            <h1 className="text-4xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-10 leading-tight">
                Request Form
            </h1>

            {/* Error  */}
            { message && 
            <p className={`max-w-3/4 rounded-lg mx-auto p-3 text-lg mb-5 ${message.type === 'success' ? 'bg-green-300' : 'bg-red-300'}`}>
              {message.text}
            </p>
            }

            {/* Category Dropdown */}
            <label className="mb-2 flex text-left font-medium">
                Request Category
            </label>

            <select className="w-full border rounded-lg p-2 bg-blue-50"
              value={selectedCategory ?? ""}
              onChange={(e) => {setSelectedCategory(Number(e.target.value)); setMessage(null);}}
            >
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} >
                        {cat.name}
                    </option>
                ))}
            </select>

            {/* Category Description */}
            {selectedCategory && (
              <div className="mt-4 p-3 bg-blue-100 rounded-lg text-left">
                <p className="font-medium text-gray-700">Description:</p>
                <p className="text-gray-600">
                  {categories.find(cat => cat.id === selectedCategory)?.description}
                </p>
              </div>
            )}

            {/* Description */}
            <label className="mt-20 mb-2 flex text-left font-medium">
                Request Description:
            </label>

            <textarea className="w-full bg-blue-50 border rounded-lg p-3 resize-y min-h-40 max-h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                placeholder='When using this....'
                onChange={(e) => {setDescription(e.target.value); setMessage(null);}}
            />

            {/* File Upload  */}
            <input className='hidden bg-blue-100 mx-auto p-1 mt-3'
              id="file-upload"
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
                }
                setMessage(null);
              }}
            />

            <label className="cursor-pointer bg-blue-100 px-4 py-2 rounded-lg inline-block hover:bg-blue-200"
              htmlFor="file-upload"
            >
              Choose files
            </label>


            {/* Display Files */}
            <ul>
              {files.map((file, index) => (
                <li key={index} className='bg-white rounded-lg w-1/3 mx-auto m-1'>
                  {file.name}{"  "}
                  <button className="text-red-500 font-bold"
                    onClick={() =>
                      setFiles(files.filter((_, i) => i !== index))
                  }>
                    Remove
                  </button>
                </li>
              ))}
            </ul>


            {/* Submit Button */}
            <button className="w-1/2 mx-auto block rounded-lg bg-cyan-100 py-2.5 text-black text-sm mt-5 font-medium hover:bg-blue-700 transition"
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </button>
        </form>
      </section>

    </div>
  );
}