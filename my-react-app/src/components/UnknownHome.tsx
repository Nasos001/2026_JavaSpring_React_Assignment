// Imports 
// ==========================================================================================================================================
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../Contexts/AuthContext';


// Main Component 
// ==========================================================================================================================================
export default function UnknownHome() {
  
  // States and Variables
  // -----------------------------------------------------------------------------------------------------------
  const { logout } = useAuth();


  // Logout 
  // -----------------------------------------------------------------------------------------------------------
  const Logout = async () => {
        try {
          await logout();
        } catch(error) {
          console.error(error);
        }
    }

  // JSX
  // -----------------------------------------------------------------------------------------------------------
  return(
    <div className="min-h-screen bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
      <div className="text-center">

        {/* Greeting */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Awaiting
          <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {" "}Role{" "}
          </span>
          Assignment from Administrator
        </h1>

        {/* Request */}
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Please remain patient while the Administrator examines your request for registration.
        </p>

        {/* Logout Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <button className="bg-blue-600 text-white px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium text-base"
              onClick={() => Logout()}
          >
            Logout
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}