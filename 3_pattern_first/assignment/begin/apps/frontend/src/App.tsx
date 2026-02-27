import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./shared/error/errorBoundary";
import { StoreProvider } from "./shared/store/storesContext";
import { PresenterProvider } from "./shared/presenters/presentersContext";
import { RegisterPage } from "./pages/join/registerPage";
import { HomePage } from "./pages/home/homePage";
import { PostPage } from "./pages/post/postPage";
import { presenters, stores } from "./main";
import { SpinnerProvider } from "./shared/spinner/spinnerContext";
import { NavigationProvider } from "./shared/navigation/navigationProvider";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <ErrorBoundary>
      <StoreProvider stores={stores}>
        <SpinnerProvider>
          <PresenterProvider presenters={presenters}>
            <BrowserRouter>
              <NavigationProvider>
                <ToastContainer />
                <Routes>
                  {/* Public routes */}
                  <Route path="/join" element={<RegisterPage />} />
                  <Route path="/" element={<HomePage />} />
                  <Route path="/posts/:slug" element={<PostPage />} />
                </Routes>
              </NavigationProvider>
            </BrowserRouter>
          </PresenterProvider>
        </SpinnerProvider>
      </StoreProvider>
    </ErrorBoundary>
  );
};

export default App;
