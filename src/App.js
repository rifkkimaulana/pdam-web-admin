import AppRouter from "./routes/AppRouter";
import { ToastContainer } from "react-toastify";

function App() {
  const themeMode = localStorage.getItem("mui-mode") || "light";

  return (
    <div>
      <AppRouter />
      <ToastContainer theme={themeMode === "dark" ? "dark" : "light"} />
    </div>
  );
}

export default App;
