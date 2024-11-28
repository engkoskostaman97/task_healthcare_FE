import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import AddPages from "./pages/AddPages";
import EditPages from "./pages/EditPages";
import Monitoring from "./pages/Monitoring";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Monitoring />} />
      <Route path="/add-data" element={<AddPages />} />
      <Route path="/edit-data/:id" element={<EditPages />} />
    </Routes>
  );
}

export default App;
