import { useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../firebase";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "../css/Register.css";
import { Link } from "react-router-dom";
import publicAxios from "../../../fetchConfig/publicAxios";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  type UserType = {
    userName: string | null;
    email: string | null;
    password: string | null;
    experience: number;
    trophy: string | null;
    role: number;
    photoURL: string | null;
  };

  const [user, setUser] = useState<UserType>({
    userName: null,
    email: null,
    password: null,
    experience: 0,
    trophy: null,
    role: 1,
    photoURL: null,
  });

  type loginType = {
    email: string;
    password: string;
  };

  let clickAudio = new Audio("/audio/Click.mp3");

  const [loginUser, setLoginUser] = useState<loginType>({
    email: "",
    password: "",
  });

  const handleGGLogin = async () => {
    clickAudio.play();
    const response = await signInWithPopup(auth, provider);

    if (response) {
      setUser({
        userName: response.user.displayName,
        email: response.user.email,
        password: response.user.uid,
        experience: 0,
        trophy: "🆕 Người Mới",
        role: 1,
        photoURL: response.user.photoURL,
      });
    }
  };

  useEffect(() => {
    console.log("check Effect");

    if (user.email) {
      publicAxios
        .post("/api/v1/register-login/google-login", user)
        //trả về token
        .then((res) => {
          localStorage.setItem("accessToken", res.data.token),
            localStorage.setItem("loginFlag", JSON.stringify(res.data.data));
          setTimeout(() => {
            window.location.href = "/new-word/1";
          }, 2000);
          /* lưu token trả về vào local
        điều hướng đến trang học tập*/
        })
        .catch((err) => console.log(err));
      toast.success("Đăng nhập thành công!", {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  }, [user]);

  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event: any) => {
    clickAudio.play();
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === true) {
      await axios
        .post("http://localhost:5500/api/v1/register-login/login", loginUser) //trả về token
        .then((res) => {
          localStorage.setItem("accessToken", res.data.token),
            localStorage.setItem("loginFlag", JSON.stringify(res.data.data));
          setTimeout(() => {
            window.location.href = "/new-word/1";
          }, 2000);
          toast.success("Đăng nhập thành công!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setValidated(true);
          /* lưu token trả về vào local
    điều hướng đến trang học tập*/
        })
        .catch((err) => {
          console.log(err);

          toast.error("Email hoặc mật khẩu bị sai rồi!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        });
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <>
      <div className="register-container ">
        <div className="register-container-wrap animate__animated animate__fadeInDown">
          <div className="register-header">
            <Link to={"/new-word/1"} onClick={() => clickAudio.play()}>
              <img src="/img/logo/close.svg" alt="" width={"35px"} />
            </Link>
            <div>Đăng nhập</div>
            <div></div>
          </div>
          <div className="register-header-text animate__animated animate__fadeIn animate__delay-1s">
            Đăng nhập tài khoản học MochiMochi
          </div>

          <div onClick={handleGGLogin} className="modal-nofi-button-contain">
            <div className="modal-nofi-login-google">
              <img src="/img/logo/g+.png" alt="" width={"45px"} /> Đăng nhập với
              G+
            </div>
          </div>

          <div className="or animate__animated animate__lightSpeedInLeft animate__delay-2s">
            Hoặc
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
                  type="email"
                  placeholder="Nhập email tài khoản của bạn"
                  aria-describedby="inputGroupPrepend"
                  required
                  className="input-element-input"
                  value={loginUser.email}
                  onChange={(e) =>
                    setLoginUser({ ...loginUser, email: e.target.value })
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
                  placeholder="Nhập chính xác mật khẩu của bạn"
                  aria-describedby="inputGroupPrepend"
                  required
                  className="input-element-input"
                  minLength={6}
                  value={loginUser.password}
                  onChange={(e) =>
                    setLoginUser({ ...loginUser, password: e.target.value })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  * Mật khẩu cần có ít nhất 06 ký tự
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Button variant="link" type="submit">
              <div className="modal-nofi-button-contain">
                <div className="modal-nofi-button">Đăng nhập</div>
              </div>
            </Button>
            <div className="have-account">Bạn đã có tài khoản?</div>
            <Link
              to={"/register"}
              onClick={() => clickAudio.play()}
              className="modal-nofi-button-contain"
            >
              <div className="modal-nofi-login-button">Đến trang đăng ký</div>
            </Link>
          </Form>
        </div>
      </div>
      <ToastContainer autoClose={1500} />
    </>
  );
};

export default Login;
