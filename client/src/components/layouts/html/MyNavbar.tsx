import "../css/MyNavbar.css";
import { useState, useEffect} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { RootState } from "../../../unity/store";
import { useDispatch } from "react-redux";
import { changeIsActive } from "../../../features/changeActive";
import { Button } from "react-bootstrap";
import { storage } from "../../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

type ClassName = string;

function MyNavbar() {
  let clickAudio = new Audio("/audio/Click.mp3");
  let navStyle = window.location.href.split("/")[3];

  const [dropDownAvatar, setDropDownAvatar] = useState<ClassName>(
    "right-drop-down-none"
  );

  const [dropDownAvatarArrow, setDropDownAvatarArrow] = useState<ClassName>(
    "dropdown-avatar-none"
  );

  const [showSetting, setShowSetting] = useState(false);
  const [showChangeAvatar, setShowChangeAvatar] = useState(false);

  // Lưu giá trị ảnh để cho xem trước và đẩy lên firebase
  const [imgPreview, setImgPreview] = useState<any>(null);
  const [imgUpload, setImgUpload] = useState<any>(null);
  const [newAvatar, setNewAvatar] = useState<any>(null);
  const [newName, setNewName] = useState<any>(null);

  // State để theo dõi trạng thái loading
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // State để thay đổi div thành input
  const [divToInput, setDivToInput] = useState<boolean>(false);

  const handleDropDown = () => {
    clickAudio.play();
    if (dropDownAvatar === "right-drop-down-none") {
      setDropDownAvatar(
        "right-drop-down animate__animated animate__fadeInDown"
      );
      setDropDownAvatarArrow("dropdown-avatar");
    } else {
      setDropDownAvatar("right-drop-down-none");
      setDropDownAvatarArrow("dropdown-avatar-none");
    }
  };

  const handleSetting = () => {
    setShowSetting(true);
  };

  const isActive = useSelector((state: RootState) => {
    return state.isActive?.value;
  });

  const dispatch = useDispatch();

  const currentUser: any = useSelector((state: RootState) => {
    return state.user.value;
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

  // Đăng xuất

  const handleLogout = () => {
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

  // Hàm xử lý khi thay đổi ảnh từ mới
  const handleImageChange = async (e: any) => {
    const file = e.target.files[0];
    setImgUpload(e.target.files[0]);
    const reader: any = new FileReader();
    reader.addEventListener("load", () => {
      setImgPreview(reader.result);
    });
    reader.readAsDataURL(file);
  };

  // Lấy thời gian hiện tại
  const today = new Date();
  const date =
    today.getFullYear() +
    "" +
    (today.getMonth() < 10
      ? "0" + (today.getMonth() + 1).toString()
      : today.getMonth() + 1) +
    "" +
    (today.getDate() < 10 ? "0" + today.getDate().toString() : today.getDate());
  const time =
    (today.getHours() < 10
      ? "0" + today.getHours().toString()
      : today.getHours()) +
    "" +
    (today.getMinutes() < 10
      ? "0" + today.getMinutes().toString()
      : today.getMinutes()) +
    "" +
    (today.getSeconds() < 10
      ? "0" + today.getSeconds().toString()
      : today.getSeconds());
  const dateTime = Number(date + time);

  // Hàm lưu giá trị ảnh cho bài học
  const handleChangeAvatar = async () => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      // Tải lên ảnh lên Firebase Storage
      const storageRef = ref(
        storage,
        `admin/users/${currentUser.userName}/${dateTime}_${currentUser.userName}`
      );

      const uploadTask = uploadBytesResumable(storageRef, imgUpload);

      uploadTask.on("state_changed", (snapshot: any) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      });

      await uploadTask;

      // Lấy URL của ảnh đã tải lên
      const imgUrl = await getDownloadURL(storageRef);
      setNewAvatar(imgUrl);
      setIsUploading(false);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Không thể tải dữ liệu", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Sau khi lưu giá trị ảnh xong thì chuyển hướng lưu vào trong database
  useEffect(() => {
    if (newAvatar) {
      try {
        axios.patch(
          `http://localhost:5550/api/v1/users/${currentUser.userId}`,
          {
            photoURL: newAvatar,
          }
        );

        toast.success("Thay đổi ảnh avatar thành công! 🌞", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setShowChangeAvatar(false);
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      } catch (error) {
        console.log(error);
      }
    }
  }, [newAvatar]);

  const handleChangeName = async () => {
    if (newName?.length < 3 || newName?.length > 10) {
      toast.error("Tên người dùng phải nằm trong khoảng 3 ~ 11 kí tự !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5550/api/v1/users/${currentUser.userId}`,
        {
          userName: newName,
        }
      );

      toast.success("Thay tên người dùng thành công! 🌞", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar
        id="nav-container"
        expand="lg"
        className="bg-body-tertiary animate__animated animate__fadeInDown"
      >
        <Nav className="me-auto">
          <Link to={"/"}>
            <img
              src="/img/logo/logo.png"
              alt="logo"
              width={"235px"}
              style={{ padding: "5px" }}
            />
          </Link>
        </Nav>
        {/* NAVBAR MIDDLE */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="nav-icon-container">
          <NavLink
            to={"/"}
            onClick={() => dispatch(changeIsActive(""))}
            className={
              isActive === "" || navStyle === ""
                ? "nav-icon-active"
                : "nav-icon"
            }
          >
            <img src="/img/navbar/home.png" alt="" />

            <div>Trang chủ</div>
          </NavLink>
          <NavLink
            to={"/new-word/1"}
            onClick={() => dispatch(changeIsActive("new-word"))}
            className={
              isActive === "new-word" || navStyle === "new-word"
                ? "nav-icon-active"
                : "nav-icon"
            }
          >
            <img src="/img/navbar/hoc-tu-moi.png" alt="" />
            <div>Học từ mới</div>
          </NavLink>
          <NavLink
            to={"/note"}
            onClick={() => dispatch(changeIsActive("note"))}
            className={
              isActive === "note" || navStyle === "note"
                ? "nav-icon-active"
                : "nav-icon"
            }
          >
            <img src="/img/navbar/so-tay.png" alt="" />
            <div>Sổ tay</div>
          </NavLink>
          <NavLink
            to={"/test/1"}
            onClick={() => dispatch(changeIsActive("test"))}
            className={
              isActive === "test" || navStyle === "test"
                ? "nav-icon-active"
                : "nav-icon"
            }
          >
            <img src="/img/navbar/test.png" alt="" />
            <div>Bài Test</div>
          </NavLink>
        </Navbar.Collapse>
        {/* NAVBAR MIDDLE END */}
        {currentUser ? (
          <>
            {" "}
            <div className="nav-right">
              <div className="username animate__animated animate__bounce animate__slow animate__delay-1s animate__repeat-2">
                {currentUser.userName}!
              </div>
              <div className="nav-right-avatar">
                <img src={currentUser.photoURL} alt="" />
              </div>
              <div>
                <img
                  onClick={handleDropDown}
                  className={dropDownAvatarArrow}
                  src="/img/navbar/dropdown_menu.svg"
                  alt=""
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="nav-right">
              <div className="username animate__animated animate__bounce animate__slow animate__delay-1s animate__repeat-2">
                Khách!
              </div>
              <div className="nav-right-avatar">
                <img src="/img/logo/avatar.png" alt="ahihi" />
              </div>
              <div>
                <img
                  onClick={handleDropDown}
                  className={dropDownAvatarArrow}
                  src="/img/navbar/dropdown_menu.svg"
                  alt=""
                />
              </div>
            </div>
          </>
        )}
      </Navbar>
      <div className={dropDownAvatar}>
        <div className="academic-achievement">
          <img src="/img/navbar/thanh-tich-hoc-tap.png" alt="" />
          <div>Thành tích học tập</div>
        </div>
        <div onClick={handleSetting} className="setting">
          <img src="/img/navbar/cai-dat-tai-khoan.png" alt="" />
          <div>Cài đặt tài khoản</div>
        </div>
        {currentUser ? (
          <>
            <div onClick={handleLogout} className="setting">
              <img src="/img/navbar/log-out.png" alt="" />
              <div>Đăng xuất</div>
            </div>
          </>
        ) : (
          <></>
        )}
        {/* MODAL SETTING */}
        <Modal
          backdrop="static"
          keyboard={false}
          show={showSetting}
          onHide={() => setShowSetting(false)}
        >
          <Modal.Header>
            <div className="list-course-modal-title">
              <div>
                <img
                  onClick={() => setShowSetting(false)}
                  src="/img/logo/close.svg"
                  alt=""
                />
              </div>
              <div className="list-course-modal-title-text">
                CÀI ĐẶT TÀI KHOẢN
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            {currentUser ? (
              <>
                <div className="setting-container">
                  <div onClick={handleLogout} className="setting-login">
                    Đăng xuất
                  </div>
                  <div
                    onClick={() => setShowChangeAvatar(true)}
                    className="avatar-edit"
                  >
                    <img
                      width={"32px"}
                      src="/img/logo/edit-profile.svg"
                      alt=""
                    />
                  </div>
                  <div className="setting-avatar">
                    <img src={currentUser.photoURL} alt="" />
                  </div>
                  <div className="setting-trophy">{currentUser.trophy}</div>
                  <div className="setting-name-container">
                    {divToInput === false ? (
                      <>
                        <div className="setting-name">
                          {currentUser.userName}
                        </div>
                        <img
                          onClick={() => {
                            setDivToInput(true),
                              setNewName(currentUser.userName);
                          }}
                          width={"32px"}
                          src="/img/logo/edit-profile.svg"
                          alt=""
                        />
                      </>
                    ) : (
                      <>
                        <div className="username-input">
                          <input
                            type="text"
                            onChange={(e) => setNewName(e.target.value)}
                            minLength={3}
                            maxLength={10}
                            value={newName}
                          />
                          <Button variant="warning" onClick={handleChangeName}>
                            Thay đổi tên
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => setDivToInput(false)}
                          >
                            Hủy
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="setting-level">
                    Cấp Độ Người Dùng:{" "}
                    <span style={{ color: "#ffa500" }}>
                      {Math.floor(currentUser.experience / 10)}
                    </span>
                  </div>
                  <div className="setting-other">
                    Email: {currentUser.email}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="setting-container">
                  <Link
                    to={"/login"}
                    onClick={() => {
                      clickAudio.play(), setShowSetting(false);
                    }}
                    className="setting-login"
                  >
                    Đăng nhập
                  </Link>
                  <div className="avatar-edit">
                    <img
                      width={"32px"}
                      src="/img/logo/edit-profile.svg"
                      alt=""
                    />
                  </div>
                  <div className="setting-avatar">
                    <img src="/img/logo/avatar.png" alt="" />
                  </div>
                  <div className="setting-trophy">Chưa có tài khoản</div>
                  <div className="setting-name-container">
                    <div className="setting-name">Khách</div>
                    <img
                      width={"32px"}
                      src="/img/logo/edit-profile.svg"
                      alt=""
                    />
                  </div>
                  <div className="setting-level">
                    Cấp Độ Người Dùng:{" "}
                    <span style={{ color: "#ffa500" }}>0</span>
                  </div>
                  <div className="setting-other">Email: Chưa có tài khoản</div>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>

        {/* MODAL ĐỔI AVATAR */}
        <Modal
          style={{ paddingTop: "85px" }}
          className="add-post-modal"
          backdrop="static"
          show={showChangeAvatar}
          onHide={() => setShowChangeAvatar(false)}
        >
          <Modal.Body>
            <div
              style={{
                fontSize: "20px",
                textAlign: "center",
                fontWeight: "700",
              }}
            >
              THAY ĐỔI ẢNH AVATAR
            </div>
            <Form.Control
              onChange={handleImageChange}
              style={{ margin: "25px 0" }}
              type="file"
            />

            <div className="preview-img-container">
              <div className="preview-img">
                {!imgPreview ? (
                  <></>
                ) : (
                  <>
                    <img src={imgPreview} alt="" />
                  </>
                )}
              </div>
            </div>

            {isUploading && (
              <div>
                <div>Loading...</div>
                <div>{uploadProgress}%</div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              style={{ fontWeight: "bolder" }}
              variant="warning"
              onClick={handleChangeAvatar}
              disabled={isUploading} // Disable button during upload
            >
              {isUploading ? "Đang tải lên..." : "Thay đổi ảnh avatar"}
            </Button>
            <Button variant="danger" onClick={() => setShowChangeAvatar(false)}>
              Hủy
            </Button>
          </Modal.Footer>
        </Modal>
        {/* MODAL ĐỔI AVATAR END*/}
        <ToastContainer
          autoClose={1500}
          style={{ fontWeight: "normal", textAlign: "center" }}
        />
      </div>
    </>
  );
}

export default MyNavbar;
