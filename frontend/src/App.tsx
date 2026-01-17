import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import routes from "./routes";
import { Toaster } from "sonner";
import { useGetMyProfile } from "./services/myAccount";
import { useEffect } from "react";
import { updateFavicon } from "./utils/helper";

function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

function App() {
  //dynamic the tab logo
  const { data } = useGetMyProfile();

  useEffect(() => {
    const logo = data?.data?.company_logo_url;
    if (logo) updateFavicon(logo);
  }, [data?.data?.company_logo_url]);

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </Router>
  );
}

export default App;
