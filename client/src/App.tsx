import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/pages/html/Home";
import MyNavbar from "./components/layouts/html/MyNavbar";
import ScrollToTop from "./components/layouts/html/ScrollToTop";
import NewWord from "./components/pages/html/NewWord";
import Note from "./components/pages/html/Note";
import Footer from "./components/layouts/html/Footer";
import Test from "./components/pages/html/Test";
import Register from "./components/pages/html/Register";
import Login from "./components/pages/html/Login";
import NewWordCard from "./components/pages/html/NewWordCard";
import AdminPage from "./components/admin/html/AdminPage";
import axios from "axios";
import { changeUser } from "./features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./unity/store";
import ListUser from "./components/admin/html/ListUser";
import CoursesManagement from "./components/admin/html/CoursesManagement";
import TestManagement from "./components/admin/html/TestManagement";
import TestDetail from "./components/pages/html/TestDetail";
import ServerError from "./components/layouts/html/ServerError";

function App() {
  const dispatch = useDispatch();
  const loadData = async () => {
    const loginFlag = localStorage.getItem("loginFlag");
    const email = loginFlag ? JSON.parse(loginFlag).email : null;
    console.log(email);

    try {
      const response = await axios.get(
        `http://localhost:5550/api/v1/users/email?email=${email}`
      );
      console.log(response);

      dispatch(changeUser(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const currentUser = useSelector((state: RootState) => {
    return state.user.value;
  });

  console.log(!currentUser, "<==== currentUser");

  useEffect(() => {
    loadData();
  }, []);

  console.log("currentUser ===>", currentUser.role);

  return (
    <>
      <Router>
        {currentUser?.role === 0 ? (
          <>
            <Routes>
              <Route path="tests-management" element={<TestManagement />} />
              <Route
                path="/courses-management"
                element={<CoursesManagement />}
              />
              <Route path="/list-users" element={<ListUser />} />
              <Route path="*" element={<AdminPage />} />
            </Routes>
            <ScrollToTop />
          </>
        ) : currentUser?.role === 1 ? (
          <>
            <MyNavbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="/new-word/:id/:id/:id" element={<NewWordCard />} />
              <Route path="/new-word/:id" element={<NewWord />} />
              <Route path="/note" element={<Note />} />
              <Route path="/test/:id/:id" element={<TestDetail />} />
              <Route path="/test/:id" element={<Test />} />
              <Route path="*" element={<Home />} />
            </Routes>
            <Footer />
            <ScrollToTop />
          </>
        ) : (
          <>
            <Routes>
              <Route path="*" element={<ServerError />} />
            </Routes>
          </>
        )}
      </Router>
    </>
  );
}

export default App;
