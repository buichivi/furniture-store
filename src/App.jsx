import MainLayout from "./layouts/MainLayout";
import { public_routes } from "./routes";
import { Routes, Route } from "react-router-dom";
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
                                <Element />
                            </MainLayout>
                        }
                    />
                );
            })}
        </Routes>
    );
}

export default App;
