// Imports 
// ===========================================================================================================================================================
import { useAuth } from "../Contexts/AuthContext";

// Interfaces
// ===========================================================================================================================================================
interface welcome {
  user: string,
  questions: string[]
}

// Main Component
// ===========================================================================================================================================================
export default function HomePage() {
  // Variables
  const {role} = useAuth();

  // Determine role
  // -----------------------------------------------------------------------------------------------------------------
  const welcome: welcome = 
    role === "USER" ? {user: "User", questions: ["Make a new request?", "Monitor a request?", "Check your history?"]} 
    :
    role === "TECHNICIAN" ? {user: "Technician", questions: ["Assign a request?", "Update a Request?", "Complete a request?"]} 
    :
    {user: "Admin", questions: ["Check Registrations?", "Update a User's Info?", "Check Requests?"]}

  // JSX
  // -----------------------------------------------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white">

      {/* Main Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">

        {role == "USER" && 
          <div className="text-center">
            {/* Greeting */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              How can we help you today dear
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}{welcome.user}{" "}
              </span>
              ?
            </h1>
            
            {/* Questions */}
            <div className="relative mt-24 h-96">
              <div className="absolute top-0 left-5 p-5 text-bold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent py-6">
                welcome.questions[0]
              </div>

              <div className="absolute top-24 right-12 p-4 text-bold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent py-6">
                welcome.questions[1]
              </div>

              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 p-4 text-bold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent py-6">
                welcome.questions[2]
              </div>
            </div>
          </div>
        }
      </section>

      {/* Invitation */}
      <div className="bottom-0 right-0 left-0 bg-linear-to-r from-blue-600 to-purple-600 text-white py-6 max-w-7xl mx-auto text-center text-4xl font-bold">
          Choose your next step from the header!
      </div>
    </div>
  );
}