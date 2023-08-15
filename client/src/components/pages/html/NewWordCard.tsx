import { useEffect, useState } from "react";
import "../css/NewWordCard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../../unity/store";
import { Zoom } from "react-toastify";

interface NewWord {
  newWordId: number;
  lessonId: number;
  title: string;
  contentOne: string;
  contentTwo: string;
  pronound: string;
  translate: string;
  newWordImg: string;
  voice: string;
}

function NewWordCard() {
  let navigate = useNavigate();
  let courseId = Number(window.location.href.split("/")[4]);
  let lessonId = Number(window.location.href.split("/")[5]);
  let newWordId = Number(window.location.href.split("/")[6]);

  const [disableButton, setDisableButton] = useState<boolean>(false);

  // lấy từ mới tương ứng mỗi bài học
  const [listNewWords, setListNewWords] = useState<any>([]);

  const loadNewWords = async () => {
    let result = await axios.get(
      `http://localhost:5550/api/v1/new_words/${lessonId}`
    );
    setListNewWords(result.data);
  };

  useEffect(() => {
    loadNewWords();
  }, [lessonId]);

  // lấy từ mới tương ứng mỗi bài học
  const [newWord, setNewWord] = useState<NewWord>();

  const loadNewWord = async () => {
    let result = await axios.get(
      `http://localhost:5550/api/v1/new_words/new_word/${newWordId}`
    );
    setNewWord(result.data);
  };

  useEffect(() => {
    loadNewWord();
  }, [newWordId]);

  const currentWord =
    listNewWords.findIndex(
      (item: any) => item.newWordId === newWord?.newWordId
    ) + 1;

  let clickAudio = new Audio("/audio/Click.mp3");
  let endLessonAudio = new Audio("/audio/EndGame.mp3");
  let streakDayAudio = new Audio("/audio/streak_day.mp3");
  let voice = new Audio(newWord?.voice);

  const currentUser: any = useSelector((state: RootState) => {
    return state.user.value;
  });

  // lấy trạng thái hoàn thành bài học
  const [checkComplete, setCheckComplete] = useState<any>([]);

  const loadComplete = async () => {
    let result = await axios.get(
      `http://localhost:5550/api/v1/lessons_complete/${currentUser.userId}`
    );
    setCheckComplete(result.data.filter((e: any) => e.lessonId === lessonId));
  };

  useEffect(() => {
    loadComplete();
  }, [currentUser]);

  let newComplete = {
    lessonId: lessonId,
    userId: currentUser.userId,
  };

  let newExperience = currentUser.experience + 1;

  console.log(newComplete);

  console.log(currentUser.experience);

  console.log("checkComplete ===>", checkComplete.length);

  // Thêm kinh nghiệm và chuyển trang
  const handleChangePage = async () => {
    if (currentWord >= listNewWords.length) {
      if (checkComplete.length === 0) {
        await axios
          .post(`http://localhost:5550/api/v1/lessons_complete`, newComplete)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => console.log(err));
      }
      clickAudio.play();
      endLessonAudio.play();
      await axios
        .patch(`http://localhost:5550/api/v1/users/${currentUser.userId}`, {
          experience: newExperience,
        })
        .then((res) => res.data)
        .catch((err) => console.log(err));
      toast.success("Hoàn thành bài học!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      toast.success("Kinh nghiệm + 1!", {
        position: toast.POSITION.TOP_RIGHT,
        theme: "colored",
      });
      if (currentUser.experience === 10) {
        await axios
          .patch(`http://localhost:5550/api/v1/users/${currentUser.userId}`, {
            trophy: "🌸 Nhận Biết Mặt Chữ",
          })
          .then((res) => res.data)
          .catch((err) => console.log(err));
        toast("Nhận được danh hiệu: 🌸 Nhận Biết Mặt Chữ !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        streakDayAudio.play();
      } else if (currentUser.experience === 50) {
        await axios
          .patch(`http://localhost:5550/api/v1/users/${currentUser.userId}`, {
            trophy: "🌻 Hiểu Chút Xíu",
          })
          .then((res) => res.data)
          .catch((err) => console.log(err));
        toast("Nhận được danh hiệu: 🌻 Hiểu Chút Xíu !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        streakDayAudio.play();
      } else if (currentUser.experience === 100) {
        await axios
          .patch(`http://localhost:5550/api/v1/users/${currentUser.userId}`, {
            trophy: "💐 Mầm Non Bản Địa",
          })
          .then((res) => res.data)
          .catch((err) => console.log(err));
        toast("Nhận được danh hiệu: 💐 Mầm Non Bản Địa !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        streakDayAudio.play();
      } else if (currentUser.experience === 500) {
        await axios
          .patch(`http://localhost:5550/api/v1/users/${currentUser.userId}`, {
            trophy: "🍁 Đọc Hiểu Thông Thường",
          })
          .then((res) => res.data)
          .catch((err) => console.log(err));
        toast("Nhận được danh hiệu: 🍁 Đọc Hiểu Thông Thường !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        streakDayAudio.play();
      } else if (currentUser.experience === 1000) {
        await axios
          .patch(`http://localhost:5550/api/v1/users/${currentUser.userId}`, {
            trophy: "🏫 Trung Học Bản Địa",
          })
          .then((res) => res.data)
          .catch((err) => console.log(err));
        toast("Nhận được danh hiệu: 🏫 Trung Học Bản Địa !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        streakDayAudio.play();
      } else if (currentUser.experience === 2500) {
        await axios
          .patch(`http://localhost:5550/api/v1/users/${currentUser.userId}`, {
            trophy: "️🎖️ Tiếng Anh Thông Thạo",
          })
          .then((res) => res.data)
          .catch((err) => console.log(err));
        toast("Nhận được danh hiệu: 🎖️ Tiếng Anh Thông Thạo !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        streakDayAudio.play();
      }
      setDisableButton(true);
      setTimeout(() => {
        navigate(`/new-word/${courseId}`);
      }, 3500);
    } else {
      clickAudio.play();
      navigate(`/new-word/${courseId}/${lessonId}/${newWordId + 1}`);
    }
  };

  return (
    <>
      <div className="flip-card-container">
        <div onClick={() => voice.play()} className="flip-card-sound">
          <img src="/img/logo/sound.svg" alt="" />
        </div>
        <div className="flip-card">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img src={newWord?.newWordImg} alt="Avatar" />
              <div style={{ margin: "0 15px" }}>
                {newWord?.contentOne} <span>{newWord?.title}</span>
                {newWord?.contentTwo}
              </div>
            </div>
            <div className="flip-card-back">
              <div className="flip-card-back-title">{newWord?.title}</div>
              <div className="flip-card-back-pronound">{newWord?.pronound}</div>
              <p style={{ fontWeight: "700" }}>{newWord?.translate}</p>
            </div>
          </div>
        </div>
        <div className="new-word-quantity">
          Số từ :{" "}
          <span>
            {currentWord} / {listNewWords.length}
          </span>
        </div>
        <div className="home-wrap-button-contain">
          <div
            onClick={disableButton === false ? handleChangePage : () => {}}
            style={{ fontWeight: "700" }}
            className="home-wrap-button"
          >
            TIẾP TỤC
          </div>
        </div>
      </div>
      <div className="click-hand">
        <img src="/img/logo/click-hand.png" alt="" />
      </div>

      <ToastContainer autoClose={2000} transition={Zoom} />
    </>
  );
}

export default NewWordCard;
