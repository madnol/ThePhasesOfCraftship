import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

import { ErrorBoundary } from "./shared/error/errorBoundary";

import { StoreProvider } from "./shared/store/storesContext";
import { PresenterProvider } from "./shared/presenters/presentersContext";

import { SubmissionPage } from "./pages/submission/submissionPage";
import { RegisterPage } from "./pages/join/registerPage";
import { OnboardingPage } from "./pages/onboarding/onboardingPage";
import { HomePage } from "./pages/home/homePage";
import { PostPage } from "./pages/post/postPage";
import { presenters, stores } from "./main";
import { SpinnerProvider } from "./shared/spinner/spinnerContext";
import { NavigationProvider } from "./shared/navigation/navigationProvider";
import { ProtectedRoute } from "./modules/auth/protectedRoute";
import { OnboardingGuard } from "./modules/auth/onboardingGuard";

const App = () => {
  return (
    <ErrorBoundary>
      <StoreProvider stores={stores}>
        <SpinnerProvider>
          <PresenterProvider presenters={presenters}>
            <BrowserRouter>
              <NavigationProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/join" element={<RegisterPage />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  
                  {/* Protected routes that need onboarding check */}
                  <Route path="/" element={
                    <OnboardingGuard>
                      <HomePage />
                    </OnboardingGuard>
                  } />
                  <Route path="/posts/:slug" element={<PostPage />} />
                  <Route path="/submit" element={
                    <ProtectedRoute>
                      <OnboardingGuard>
                        <SubmissionPage />
                      </OnboardingGuard>
                    </ProtectedRoute>
                  } />
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
