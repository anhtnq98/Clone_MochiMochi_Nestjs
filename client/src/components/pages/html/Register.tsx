import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "../css/Register.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Register() {
  type UserType = {
    userName: string;
    email: string;
    password: string;
    experience: number;
    trophy: string;
    role: number;
    photoURL: string;
  };

  const [newUser, setNewUser] = useState<UserType>({
    userName: "",
    email: "",
    password: "",
    experience: 0,
    trophy: "🆕 Người Mới",
    role: 1,
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/mochimochi-clone.appspot.com/o/mochi-icon%2Favatar.png?alt=media&token=f8508f5e-b0ba-4b95-b293-6d0dde576878",
  });

  const [validated, setValidated] = useState(false);

  let clickAudio = new Audio("/audio/Click.mp3");

  const handleSubmit = async (e: any) => {
    clickAudio.play();
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      try {
        await axios
          .post(`http://localhost:5550/api/v1/auth/register`, newUser)
          .then((res) => {
            toast.success(`${res.data.message}`, {
              position: toast.POSITION.TOP_RIGHT,
            });
            localStorage.setItem("loginFlag", JSON.stringify(res.data.user));
            setTimeout(() => {
              window.location.href = "/home";
            }, 2500);
            console.log(res);
            console.log("0000");
          })
          .catch((error) => {
            toast.warning(`${error.response.data.message}`, {
              position: toast.POSITION.TOP_RIGHT,
            }),
              console.log("111");
            console.log(error);
          });
      } catch (error) {
        console.log("222");
        console.log(error);
      }
    }
    setValidated(true);
  };
  // demo
  return (
    <div className="register-container">
      <div className="register-container-wrap animate__animated animate__fadeInDown">
        <div className="register-header">
          <Link to={"/new-word/1"} onClick={() => clickAudio.play()}>
            <img src="/img/logo/back.png" width={"35px"} />
          </Link>
          <div>Tạo tài khoản mới</div>
          <div></div>
        </div>
        <div className="register-header-text animate__animated animate__fadeInDown animate__delay-1s">
          Cùng tạo 1 tài khoản Mochi nào
        </div>
        <div className="register-img">
          <img src="/img/logo/register.png" alt="" />
        </div>

        {/* USERNAME */}
        <Form
          className="input-element-container"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <Form.Group
            className="input-element"
            controlId="validationCustomUsername"
          >
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder="Tên của bạn"
                aria-describedby="inputGroupPrepend"
                required
                minLength={3}
                maxLength={11}
                value={newUser.userName}
                onChange={(e) =>
                  setNewUser({ ...newUser, userName: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                * Tên hiển thị cần có từ 3-11 ký tự
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          {/* USERNAME END*/}

          <Form.Group
            className="input-element"
            controlId="validationCustomUsername"
          >
            <InputGroup hasValidation>
              <Form.Control
                type="email"
                placeholder="Nhập chính xác email của bạn"
                aria-describedby="inputGroupPrepend"
                required
                className="input-element-input"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                * Email sai định dạng, bạn kiểm tra lại nhé
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group
            className="input-element"
            controlId="validationCustomUsername"
          >
            <InputGroup hasValidation>
              <Form.Control
                type="password"
                placeholder="Tạo mật khẩu (Dễ nhớ chút nhé ^^)"
                aria-describedby="inputGroupPrepend"
                required
                className="input-element-input"
                value={newUser.password}
                minLength={6}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                * Mật khẩu cần có ít nhất 06 ký tự
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              required
              label="Đồng ý với chính sách và điều khoản"
              feedback="Bạn phải tích vào ô đồng ý đẫ."
              feedbackType="invalid"
            />
          </Form.Group>

          <Button variant="link" type="submit">
            <div className="modal-nofi-button-contain">
              <div className="modal-nofi-button">Tạo tài khoản mới</div>
            </div>
          </Button>
          <div className="have-account">Chưa có tài khoản?</div>
          <Link
            to={"/login"}
            onClick={() => clickAudio.play()}
            className="modal-nofi-button-contain"
          >
            <div className="modal-nofi-login-button">Đến trang đăng nhập</div>
          </Link>
        </Form>
      </div>
      <ToastContainer autoClose={1500} />
    </div>
  );
}

export default Register;
