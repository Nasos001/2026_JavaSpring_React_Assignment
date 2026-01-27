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
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [description, setDescription] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<boolean | null>();

  // Retrieve Categories 
  // ----------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchCategories = async () => {
        try {
            // Make fetch
            const result = await fetch("http://localhost:8080/api/categories", {credentials: "include"});

            // Check result
            if (!result.ok) console.error("Failed to fetch categories");

            // Get data
            const data: Category[] = await result.json();
            setCategories(data);
        } catch (err) {
            console.error(err);
        }
    }

    fetchCategories();
  }, []);

  // Handle Submit
  // ----------------------------------------------------------------------------------------------------------
  const handleSubmit = async () => {

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
      setResult( !res.ok ? false : true);
    } catch(error) {
      console.error(error);
    }
  } 

  // JSX 
  // ----------------------------------------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white">
      {/* Main Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 mt-20 bg-cyan-600 rounded-xl shadow-xl">
        <div className="text-center">
            {/* Header */}
            <h1 className="text-4xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-10 leading-tight">
                Request Form
            </h1>

            {/* Response  */}
            { result != null && 
            <p className={"max-w-3/4 rounded-lg mx-auto p-3 text-lg mb-5 " + (result ? "bg-green-300" : "bg-red-300")}>
              {result ? "Your Request has been submitted!!!" : "Something went wrong, please try again."}
            </p>
            }

            {/* Category Dropdown */}
            <label className="mb-2 flex text-left font-medium">
                Request Category
            </label>

            <select className="w-full border rounded-lg p-2 bg-blue-50"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(Number(e.target.value))}
            >
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} >
                        {cat.name}
                    </option>
                ))}
            </select>

            {/* Description */}
            <label className="mt-20 mb-2 flex text-left font-medium">
                Request Description:
            </label>

            <textarea className="w-full bg-blue-50 border rounded-lg p-3 resize-y min-h-40 max-h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                placeholder='When using this....'
                onChange={(e) => setDescription(e.target.value)}
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
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
        </div>
      </section>

    </div>
  );
}