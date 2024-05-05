import PropTypes from 'prop-types';

const AdminLayout = ({ children }) => {
    return <div>{children}</div>;
};

AdminLayout.propTypes = {
    children: PropTypes.element,
};

export default AdminLayout;
