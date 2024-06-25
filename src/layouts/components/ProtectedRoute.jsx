import useAuthStore from '../../store/authStore';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
    const { currentUser } = useAuthStore();
    const location = useLocation();

    return currentUser?._id ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
};

export default ProtectedRoute;
