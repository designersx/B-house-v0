import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('customerToken');
// fd
  if (!user) {
    
    return <Navigate to="/" />;
  }

 
  return children;
};

export default ProtectedRoute