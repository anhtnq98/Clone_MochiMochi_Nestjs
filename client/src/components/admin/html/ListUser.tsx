import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import "../css/AdminPage.css";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";

interface User {
  userId: string;
  photoURL: string;
  userName: string;
  experience: number;
  trophy: string;
  role: number;
  email: string;
}

const ListUser = () => {
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = async () => {
    let result = await axios.get(`http://localhost:5500/api/v1/users`);
    let listUser = result.data.data.filter((e: any) => e.role !== 0);
    setUsers(listUser);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // lấy trạng thái hoàn thành bài học
  const [complete, setComplete] = useState<any>([]);
  const loadComplete = async () => {
    let result = await axios.get(
      `http://localhost:5500/api/v1/lessons_complete`
    );
    setComplete(result.data.data);
  };

  useEffect(() => {
    loadComplete();
  }, []);

  console.log(complete.filter((e: any) => e?.userId === 1)[0]);

  const renderUserList = () => {
    const itemsPerPage = 10;
    const totalPages = Math.ceil(users.length / (itemsPerPage / 2));

    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedUsers = users.slice(startIndex, endIndex);

    return (
      <>
        <div className="users-container  animate__animated animate__slow animate__fadeInDown">
          {displayedUsers.map((user, index) => (
            <div key={index} className="user-block">
              <div className="user-avatar">
                <img src={user?.photoURL} alt="" />
              </div>
              <div className="user-infor">
                <div style={{ fontSize: "23px" }}>{user?.userName}</div>
                <div>
                  ⭐ Kinh Nghiệm:{" "}
                  <span>
                    {Math.floor(user?.experience / 10)} ({user?.experience % 10}{" "}
                    / 10)
                  </span>
                </div>
                <div>
                  ️🏆 Danh Hiệu: <span>{user?.trophy}</span>
                </div>
                <div>
                  📚 Số Bài Đã Học:{" "}
                  <span>
                    {complete.filter(
                      (e: any) => e?.userId === user?.userId
                    )[0] !== undefined
                      ? complete.filter((e: any) => e?.userId === user?.userId)
                          .length
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? "success" : "light"}
              size="sm"
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </>
    );
  };

  return (
    <Container className="admin-page-big-container">
      <Row>
        <div className="admin-page-container">
          <AdminNavbar />
          <Col md={8}>
            <div className="management ">
              <div className="management-title ">DANH SÁCH NGƯỜI DÙNG</div>
              <div className="management-search-only">
                {/* SEARCH */}
                <div className="management-search">
                  <input type="text" placeholder="Tìm kiếm tên người dùng..." />
                  <img src="/img/logo/search.svg" alt="" />
                </div>
                {/* SEARCH END*/}
              </div>
              {renderUserList()}
            </div>
          </Col>
        </div>
      </Row>
    </Container>
  );
};

export default ListUser;
