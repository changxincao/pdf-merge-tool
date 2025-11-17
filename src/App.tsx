import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UploadPage } from "@/pages/UploadPage";
import { LayoutPage } from "@/pages/LayoutPage";
import { ProcessPage } from "@/pages/ProcessPage";
import { HistoryPage } from "@/pages/HistoryPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/layout" element={<LayoutPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
}
