import useAuthStore from '../../store/authStore';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuthStore();
    const location = useLocation();
    return currentUser?._id ? children : <Navigate to="/login" replace state={{ from: location }} />;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node,
};

export default ProtectedRoute;
