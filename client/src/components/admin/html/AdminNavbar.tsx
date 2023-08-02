import { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Col } from "react-bootstrap";
import { auth } from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../unity/store";
import { NavLink } from "react-router-dom";
import { changeIsActive } from "../../../features/changeActive";

function AdminNavbar() {
  let navStyle = window.location.href.split("/")[3];
  const dispatch = useDispatch();
  let clickAudio = new Audio("/audio/Click.mp3");

  const currentUser: any = useSelector((state: RootState) => {
    return state.user.value;
  });

  const isActive = useSelector((state: RootState) => {
    return state.isActive?.value;
  });

  // Trạng thái đăng nhập
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const loginUser = user;
        // ...
        console.log("Người đăng nhập hiện tại", loginUser);
      } else {
        // User is signed out
        // ...
        console.log("Trong trạng thái đăng xuất");
      }
    });
  }, []);

  const handleLogOut = () => {
    clickAudio.play();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem("accessToken");
        localStorage.removeItem("loginFlag");
        window.location.href = "/login";
      })
      .catch((error) => {
        console.log("Lỗi không thể đăng xuất", error);
        // An error happened.
      });
  };

  return (
    <>
      <Col md={3}>
        <div className="admin-info ">
          <div
            className="admin-avatar"
            style={{
              backgroundImage: `url(${currentUser.photoURL})`,
            }}
          ></div>
          <div className="admin-details">
            <h3 className="admin-name">{currentUser.userName}</h3>
            <p className="admin-email">{currentUser.email}</p>
          </div>
          <div className="home-wrap-button-contain">
            <div
              onClick={handleLogOut}
              style={{ fontWeight: "700" }}
              className="home-wrap-button"
            >
              <img src="/img/navbar/log-out.png" alt="" width="45px" /> Đăng
              xuất
            </div>
          </div>
          <div className="admin-index">
            <NavLink
              to={"/"}
              onClick={() => dispatch(changeIsActive(""))}
              className={
                isActive === "" || navStyle === ""
                  ? "admin-index-active"
                  : "admin-index-non-active"
              }
            >
              Thông tin tổng quát
            </NavLink>
            <NavLink
              to={"/list-users"}
              onClick={() => dispatch(changeIsActive("list-users"))}
              className={
                isActive === "list-users" || navStyle === "list-users"
                  ? "admin-index-active"
                  : "admin-index-non-active"
              }
            >
              Danh sách người dùng
            </NavLink>
            <NavLink
              to={"/courses-management"}
              onClick={() => dispatch(changeIsActive("courses-management"))}
              className={
                isActive === "courses-management" ||
                navStyle === "courses-management"
                  ? "admin-index-active"
                  : "admin-index-non-active"
              }
            >
              Quản lý khóa học
            </NavLink>
            <NavLink
              to={"/tests-management"}
              onClick={() => dispatch(changeIsActive("tests-management"))}
              className={
                isActive === "tests-management" ||
                navStyle === "tests-management"
                  ? "admin-index-active"
                  : "admin-index-non-active"
              }
            >
              Quản lý bài test
            </NavLink>
          </div>
        </div>
      </Col>
    </>
  );
}

export default AdminNavbar;
