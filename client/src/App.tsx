import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import First from "./components/First";
import Home from "./components/Home";

function App() {
  return (
    <>
      <First />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
