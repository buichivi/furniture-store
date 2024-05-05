import useAuthStore from '../../store/authStore';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiRequest from '../../utils/apiRequest';

const ProtectedRoute = ({ children }) => {
    const { loginUser } = useAuthStore();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        apiRequest
            .get('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                loginUser(res.data.user);
            })
            .catch(() => {
                console.log('error');
                navigate('/login');
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.element,
};

export default ProtectedRoute;
