import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import "../css/AdminPage.css";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";
import Loading from "../../layouts/html/Loading";
import debounce from "lodash.debounce";

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
  const [loading, setLoading] = useState(false);

  // search
  const [searchUserValue, setSearchUserValue] = useState<string>("");
  const searchValue = searchUserValue.trim();

  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = () => {
    setLoading(true);
    setTimeout(() => {
      axios
        .get(
          `http://localhost:5550/api/v1/users/search?searchValue=${searchValue}`
        )
        .then((res) => {
          let listUser = res.data.filter((e: any) => e.role !== 0);
          setUsers(listUser);
        })
        .catch((err) => console.log(err));
      setLoading(false);
    }, 750);
  };

  useEffect(() => {
    const delayedSearch = debounce(loadUsers, 1000); // Đặt thời gian debounce là 500ms
    delayedSearch();
    return delayedSearch.cancel; // Hủy debounce khi component bị hủy
  }, [searchValue]);

  // lấy trạng thái hoàn thành bài học
  const [complete, setComplete] = useState<any>([]);
  const loadComplete = async () => {
    await axios
      .get(`http://localhost:5550/api/v1/lessons_complete`)
      .then((res) => {
        setComplete(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadComplete();
  }, []);

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
        <div className="users-container  animate__animated animate__slower animate__fadeInDown">
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
        {loading ? <Loading /> : <></>}
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
                  <input
                    onChange={(e: any) => setSearchUserValue(e.target.value)}
                    value={searchUserValue}
                    type="text"
                    placeholder="Tìm kiếm tên người dùng..."
                  />
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
