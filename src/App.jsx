import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import WeightTracking from "./pages/WeightTracking";
import StepsTracking from "./pages/StepsTracking";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/weight"
            element={<WeightTracking />}
          />

          <Route
            path="/steps"
            element={<StepsTracking />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;