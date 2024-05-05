import { AdminLogin } from './admin/pages';
import admin_routes from './admin/routes';
import { ScrollToTop } from './components';
import MainLayout from './layouts/MainLayout';
import { ProtectedRoute } from './layouts/components';
import { Login, Register } from './pages';
import { private_routes, public_routes } from './routes';
import { Routes, Route } from 'react-router-dom';
function App() {
    return (
        <Routes>
            {public_routes.map(({ path, element: Element }, index) => {
                return (
                    <Route
                        key={index}
                        path={path}
                        element={
                            <MainLayout>
                                <>
                                    <ScrollToTop />
                                    <Element />
                                </>
                            </MainLayout>
                        }
                    />
                );
            })}
            {private_routes.map(({ path, element: Element }, index) => {
                return (
                    <Route
                        key={index}
                        path={path}
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <>
                                        <ScrollToTop />
                                        <Element />
                                    </>
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                );
            })}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ###### */}

            {/* {admin_routes.map(({ path, element: Element }, index) => {
                return <Route key={index} path={path} element={}></Route>;
            })} */}
            {/* Admin route */}
            <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
    );
}

export default App;
