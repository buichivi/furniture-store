import { ScrollToTop } from "./components";
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
                                <>
                                    <ScrollToTop />
                                    <Element />
                                </>
                            </MainLayout>
                        }
                    />
                );
            })}
        </Routes>
    );
}

export default App;
