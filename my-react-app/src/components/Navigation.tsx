// Imports 
// ===================================================================================================================================================
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Menu, X } from 'lucide-react';
import { useAuth } from '../Contexts/AuthContext';

// Interfaces
// ===================================================================================================================================================
type MenuItem = {
    label: string;
    action: () => void;
};

// Main Component
// ===================================================================================================================================================
export default function Navigation() {
    // States & Variables
    // -----------------------------------------------------------------------------------------------
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    const {role, logout} = useAuth();
    const navigate = useNavigate();

    // Define Menu per User
    // -----------------------------------------------------------------------------------------------
    const userMenu: MenuItem[] = [
        { label: "Home", action: () => navigate("/home") },
        { label: "New Request", action: () => navigate("/new-request") },
        { label: "Monitor", action: () => navigate("/monitor") },
        { label: "History", action: () => navigate("/history") }
    ];

    const technicianMenu: MenuItem[] = [
        { label: "Home", action: () => navigate("/home") },
        { label: "Requests", action: () => navigate("/requests") }
    ];

    const adminMenu: MenuItem[] = [
        { label: "Home", action: () => navigate("/home") },
        { label: "Registrations", action: () => navigate("/registration-requests") },
        { label: "Requests", action: () => navigate("/requests") },
        { label: "Announcements", action: () => navigate("/announcements") },
        { label: "Categories", action: () => navigate("/categories") },
        { label: "Users", action: () => navigate("/users") }
    ];

    // Find Menu based on Role
    // -----------------------------------------------------------------------------------------------
    const menu =
        role === "USER" ? userMenu :
        role === "TECHNICIAN" ? technicianMenu :
        role === "ADMIN" ? adminMenu :
        [{ label: "Home", action: () => navigate("/") }];

    // Render Navigation
    // -----------------------------------------------------------------------------------------------
    const renderMenu = (isMobile: boolean) => (

        // Render CSS based on Device
        <div className={` ${isMobile ? "space-y-1 p-1" : "flex md:gap-3 lg:gap-8"}`}>

            {/* Render each item */}
            {menu.map(item => (
                <button className={`text-gray-700 hover:text-blue-600 hover:bg-indigo-100 rounded-xl w-full text-left p-1 font-semibold md:text-md lg:text-lg ${isMobile && "block"}`}
                    key={item.label}
                    onClick={() => {
                        item.action();
                        setHamburgerOpen(false);
                    }}
                >
                    {item.label}
                </button>
            ))}

            {/* Render Logout based on Role */}
            {role && (
                <button
                    onClick={async () => {
                        await Logout();
                        setHamburgerOpen(false);
                    }}
                    className={`text-gray-700 hover:text-blue-600 hover:bg-indigo-100 rounded-xl w-full text-left p-1 font-semibold  md:text-sm lg:text-lg ${isMobile && "block"}`}
                >
                    Logout
                </button>
            )}
        </div>
    );

    // Logout 
    // -----------------------------------------------------------------------------------------------
    const Logout = async () => {
        try {
            await logout();
        } catch(error) {
            console.error(error);
        }
    }

    // JSX 
    // -----------------------------------------------------------------------------------------------
    return(
    <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          
            {/* Logo */}
            <span className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MiHelper
            </span>
        
            {/* Desktop */}
            <div className="hidden md:flex">
                {renderMenu(false)}
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

        {/* Mobile */}
        {hamburgerOpen && (
            <div className="md:hidden bg-white border-t px-2 pt-2 pb-3">
                {renderMenu(true)}
            </div>
        )}
      </nav>
    )
}