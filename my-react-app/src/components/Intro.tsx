// Imports 
// ===========================================================================================================================================================
import { ChevronRight, Star, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Main Component 
// ===========================================================================================================================================================
export default function Intro() {
  // Navigation
  const navigate = useNavigate();

  // JSX
  // -----------------------------------------------------------------------------------------------------------------
  return(
    <div className="min-h-screen bg-white">

      {/* Main Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">

          {/* Greeting */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}MiHelper
            </span>
          </h1>

          {/* Invitation */}
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Submit the query you have for our Company's technical support here and watch it be resolved in the speed of light
          </p>

          {/* Login Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button className="bg-blue-600 text-white px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-colors 
            flex items-center justify-center gap-2 font-medium text-base"
                onClick={() => navigate("/login")}
            >
              Click to Enter
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Header */}
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
          Remember that...
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {/* Feature #1 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <Zap className="text-blue-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Lightning Fast</h3>
            <p className="text-gray-600 leading-relaxed">
              Experience blazing-fast performance with our optimized infrastructure and cutting-edge technology.
            </p>
          </div>

          {/* Feature #2 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <Shield className="text-purple-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure & Reliable</h3>
            <p className="text-gray-600 leading-relaxed">
              Your data is protected with enterprise-grade security and 99.9% uptime guarantee.
            </p>
          </div>

          {/* Feature #3 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
              <Star className="text-green-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy to Use</h3>
            <p className="text-gray-600 leading-relaxed">
              Intuitive interface designed for everyone, from beginners to advanced users.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}