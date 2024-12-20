import { BrowserRouter, Route, Routes } from "react-router-dom";

import Form from "./pages/Form";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm/>} />
        <Route path="/signup" element={<SignupForm/>} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
