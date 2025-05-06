import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteWatcher = () => {
    const location = useLocation();
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const fromEmail = params.get("fromEmail");
        const projectId = params.get("projectId");
        const isLoggedIn = localStorage.getItem("customerToken"); // or use auth state
        if (!isLoggedIn && fromEmail === "true" && projectId) {
            const redirectPath = `/project-delivery-list?fromEmail=true&projectId=${projectId}`;
            localStorage.setItem("fromEmailPath", redirectPath);
        }
    }, [location]);

    return null; 
};

export default RouteWatcher;
