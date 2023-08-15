import { Container, Row, Col } from "react-bootstrap";
import "../css/AdminPage.css";
import AdminNavbar from "./AdminNavbar";
import { useSelector } from "react-redux";
import { RootState } from "../../../unity/store";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const currentUser: any = useSelector((state: RootState) => {
    return state.user.value;
  });

  const [users, setUsers] = useState<any>([]);

  const loadUsers = async () => {
    let result = await axios.get(`http://localhost:5550/api/v1/users`);
    let listUser = result.data.filter((e: any) => e.role !== 0);
    setUsers(listUser);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const [listCourse, setListCourse] = useState<any>([]);
  const loadListCourse = async () => {
    let result = await axios.get(`http://localhost:5550/api/v1/courses`);
    setListCourse(result.data);
  };

  useEffect(() => {
    loadListCourse();
  }, []);

  const [listTests, setListTests] = useState<any>([]);
  const loadListTests = async () => {
    let result = await axios.get(`http://localhost:5550/api/v1/tests`);
    setListTests(result.data);
  };

  useEffect(() => {
    loadListTests();
  }, []);

  return (
    <div className="admin-page-sbig-container ">
      <Container className="admin-page-big-container ">
        <Row>
          <div className="admin-page-container ">
            <AdminNavbar />
            <Col md={8}>
              <div className="admin-page-main-big-container">
                <div className="admin-page-main-container animate__animated animate__fadeInDown">
                  <div className="welcome-admin ">
                    Chào mừng bạn trở lại <span>{currentUser?.userName}</span>
                  </div>
                </div>
                <div className="main-infor-container animate__animated animate__fadeInDown animate__slow	0.1s animate__delay-1s">
                  <div className="main-infor">
                    <div>Tổng số người dùng hiện tại: </div>
                    <div className="main-infor-quantity">{users?.length}</div>
                  </div>
                  <div className="main-infor">
                    <div>Tổng số khóa học hiện tại: </div>
                    <div className="main-infor-quantity">
                      {listCourse.length}
                    </div>
                  </div>

                  <div className="main-infor">
                    <div>Tổng số bài test hiện tại: </div>
                    <div className="main-infor-quantity">
                      {listTests?.length}
                    </div>
                  </div>
                </div>
                <div className="main-infor-img-container animate__animated animate__fadeInDown animate__slow	0.1s animate__delay-3s">
                  <div className="main-infor-one">
                    <img src="/img/logo/mochimochi-mochidemy.gif" alt="" />
                  </div>
                  <div className="main-infor-two">
                    <img src="/img/logo/speech.png" alt="" />
                  </div>
                </div>
              </div>
            </Col>
          </div>
        </Row>
        <ToastContainer autoClose={2500} />
      </Container>
    </div>
  );
};

export default AdminPage;
