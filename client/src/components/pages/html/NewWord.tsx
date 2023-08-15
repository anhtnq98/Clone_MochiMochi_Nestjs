import "../css/NewWord.css";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../unity/store";
import axios from "axios";
import { ToastContainer, Zoom, toast } from "react-toastify";

interface Courses {
  courseId: number;
  courseName: string;
  courseLangue: number;
  target: string;
  about: string;
}

interface Lesson {
  lessonId: number;
  courseId: number;
  lessonName: string;
  lessonSubName: string;
  lessonImg: string;
}

function NewWord() {
  let courseId = Number(window.location.href.split("/")[4]);
  const [lessonId, setLessonId] = useState<number>(0);
  const [newWordId, setNewWordId] = useState<number>(0);

  // LIST COURSE MODAL
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false), clickAudio.play();
  };
  const handleShow = () => {
    setShow(true), clickAudio.play();
  };

  // REGISTER NOFICATION MODAL
  const [showNofi, setShowNofi] = useState(false);
  const handleCloseNofi = () => {
    setShowNofi(false), clickAudio.play();
  };
  const handleShowNofi = () => {
    setShowNofi(true), clickAudio.play();
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const handleCloseConfirm = () => {
    setShowConfirm(false), clickAudio.play();
  };

  const currentUser: any = useSelector((state: RootState) => {
    return state.user.value;
  });

  // lấy tất cả khóa học

  let clickAudio = new Audio("/audio/Click.mp3");

  const [listCourse, setListCourse] = useState<Courses[]>([]);

  const loadListCourse = async () => {
    let result = await axios.get(`http://localhost:5550/api/v1/courses`);
    setListCourse(result.data);
  };

  useEffect(() => {
    loadListCourse();
  }, []);

  const [course, setCourse] = useState<Courses>();

  const loadCourse = async () => {
    await axios
      .get(`http://localhost:5550/api/v1/courses/${courseId}`)
      .then((res) => setCourse(res.data))
      .catch((error) => console.log(`Không thể lấy dữ liệu bởi lỗi ${error}`));
  };

  useEffect(() => {
    loadCourse();
  }, []);

  // lấy bài học tương ứng mỗi khóa
  const [listLesson, setListLesson] = useState<Lesson[]>([]);

  const loadLessons = async () => {
    let result = await axios.get(
      `http://localhost:5550/api/v1/lessons/${courseId}`
    );
    setListLesson(result.data);
  };

  useEffect(() => {
    loadLessons();
  }, []);

  // lấy từ mới tương ứng mỗi bài học
  const [listNewWords, setListNewWords] = useState<Lesson[]>([]);

  const loadNewWords = async () => {
    let result = await axios.get(
      `http://localhost:5550/api/v1/new_words/${lessonId}`
    );
    setListNewWords(result.data);
    setNewWordId(result.data[0]?.newWordId);
  };

  useEffect(() => {
    loadNewWords();
  }, [lessonId]);

  // lấy trạng thái hoàn thành bài học
  const [complete, setComplete] = useState<any>([]);

  const loadComplete = async () => {
    await axios
      .get(
        `http://localhost:5550/api/v1/lessons_complete/${currentUser.userId}`
      )
      .then((res) => {
        setComplete(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadComplete();
  }, [currentUser]);

  const handleToLesson = (courseId: number) => {
    clickAudio.play();
    setTimeout(() => {
      window.location.href = `/new-word/${courseId}/`;
    }, 500);
  };

  const handleShowConfirm = (lessonId: number) => {
    clickAudio.play();
    setLessonId(lessonId);
    setShowConfirm(true);
  };

  const handleToNewWord = () => {
    if (listNewWords.length === 0) {
      clickAudio.play();
      setShowConfirm(false);
      toast.warning("Bài học này hiện tại đang trống 😖 !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    clickAudio.play();
    setTimeout(() => {
      window.location.href = `/new-word/${courseId}/${lessonId}/${newWordId}`;
    }, 500);
  };

  return (
    <div className="new-word-container">
      {course ? (
        <>
          <div className="new-word-wrap animate__animated animate__backInUp animate__slow ">
            {/* COURSE BLOCK */}
            {listLesson?.map((lesson: any, id: number) => (
              <div
                key={lesson?.lessonId}
                onClick={
                  currentUser
                    ? () => handleShowConfirm(lesson?.lessonId)
                    : handleShowNofi
                }
                className={
                  complete?.filter((e: any) => e.lessonId === lesson?.lessonId)
                    .length !== 0
                    ? "course-block-container-complete"
                    : "course-block-container"
                }
              >
                <div
                  className={
                    complete?.lessonId === lesson?.lessonId
                      ? "course-block-img-comlete"
                      : "course-block-img"
                  }
                >
                  <img src={lesson?.lessonImg} alt="lessonImg" />
                </div>
                <div>
                  <div className="course-block-small-title">
                    {lesson?.lessonName}
                  </div>
                  <div className="course-block-sub-title">
                    {id + 1}. {lesson?.lessonSubName}
                  </div>
                </div>
              </div>
            ))}

            {/* COURSE BLOCK END*/}
          </div>
        </>
      ) : (
        <>
          <div
            style={{ padding: "115px", display: "flex", alignItems: "center" }}
            className="new-word-wrap animate__animated animate__backInUp animate__slow "
          >
            <div style={{ margin: "55px 0px 55px 0px" }}>
              Hiện tại không có khóa học nào cả 😖
            </div>
          </div>
        </>
      )}

      {/* TITLE */}
      <div className="new-word-title animate__animated animate__fadeInDown animate__delay-1s">
        {course?.courseName}
      </div>
      {/* TITLE END */}
      {/* LIST COURSE */}
      <div
        onClick={handleShow}
        className="list-course animate__animated animate__rotateInUpRight animate__delay-2s"
      >
        <div>
          <img src="/img/logo/list-course.svg" alt="" width={"40px"} />
        </div>
        <div className="list-course-text">DANH SÁCH CÁC KHÓA HỌC</div>
        <div>
          <img src="/img/logo/next-course.svg" alt="" width={"25px"} />
        </div>
      </div>
      {/* LIST COURSE END*/}

      {/* LIST COURSE MODAL BLOCK */}
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img onClick={handleClose} src="/img/logo/close.svg" alt="" />
            </div>
            <div className="list-course-modal-title-text">CÁC KHÓA HỌC</div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="list-course-modal-body">
            {listCourse?.map((course: any, id: number) => (
              <div
                onClick={() => handleToLesson(id + 1)}
                key={id}
                className="list-course-modal-block animate__animated animate__fadeInUp"
              >
                <div className="list-course-modal-block-name">
                  {course.courseName}
                </div>
                <div className="list-course-modal-small-block">
                  <div>
                    <img src="/img/logo/target.png" alt="" />
                  </div>
                  <div>{course.target}</div>
                </div>
                <div className="list-course-modal-small-block">
                  <div>
                    <img src="/img/navbar/hoc-tu-moi.png" alt="" />
                  </div>
                  <div>{course.about}</div>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
      {/* LIST COURSE MODAL BLOCK END */}

      {/* NOFI MODAL */}
      <Modal
        show={showNofi}
        onHide={handleCloseNofi}
        backdrop="static"
        keyboard={false}
        className="modal-nofi-container transparent-modal"
      >
        <img
          className="modal-nofi-close"
          src="/img/logo/close.svg"
          alt=""
          onClick={handleCloseNofi}
        />
        <Modal.Header className="modal-nofi-header">
          <img
            className="modal-nofi-img"
            src="/img/logo/register-nofication.png"
            alt=""
            width={"235px"}
          />
        </Modal.Header>
        <Modal.Body>
          <div className="modal-nofi-body">
            <div className="modal-nofi-body-text">
              Tạo tài khoản để lưu từ mới vào sổ tay nhé!
            </div>
            <Link
              to={`/register`}
              onClick={() => clickAudio.play()}
              className="modal-nofi-button-contain"
            >
              <div className="modal-nofi-button">TẠO TÀI KHOẢN MỚI</div>
            </Link>
            <Link
              to={`/login`}
              onClick={() => clickAudio.play()}
              className="modal-nofi-button-contain"
            >
              <div className="modal-nofi-login-button">ĐĂNG NHẬP</div>
            </Link>
          </div>
        </Modal.Body>
      </Modal>
      {/* NOFI MODAL END*/}

      {/* CONFIRM MODAL */}
      <Modal
        style={{ paddingTop: "115px" }}
        show={showConfirm}
        onHide={handleCloseConfirm}
        className="modal-nofi-container transparent-modal"
      >
        <Modal.Body>
          <div
            style={{ flexDirection: "column" }}
            className="list-course-modal-title"
          >
            <div style={{ fontSize: "20px", margin: "25px" }}>
              Bạn có muốn học bài này không?
            </div>

            <div>
              <img
                title="Không"
                style={{ margin: "5px" }}
                onClick={handleCloseConfirm}
                src="/img/logo/close.svg"
                alt=""
              />

              <img
                title="Có"
                style={{ margin: "5px" }}
                onClick={handleToNewWord}
                src="/img/logo/ok.png"
                alt=""
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <ToastContainer
        autoClose={1500}
        transition={Zoom}
        style={{ textAlign: "center" }}
      />
      {/* CONFIRM MODAL END*/}
    </div>
  );
}

export default NewWord;
