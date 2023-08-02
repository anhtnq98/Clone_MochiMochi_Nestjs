import React, { useEffect, useState } from "react";
import "../css/TestDetail.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TestDetail() {
  let testTableType = window.location.href.split("/")[4];

  let testId = window.location.href.split("/")[5];
  console.log(testId);
  let [showResult, setShowResult] = useState<boolean>(false);
  let navigate = useNavigate();
  let clickAudio = new Audio("/audio/Click.mp3");

  let [listCurrentAnswer, setListCurrentAnswer] = useState<any>({
    a1: "",
    a2: "",
    a3: "",
    a4: "",
    a5: "",
    a6: "",
    a7: "",
    a8: "",
    a9: "",
    a10: "",
  });

  let [listRightAnswer, setListRightAnswer] = useState<any>({
    a1: "",
    a2: "",
    a3: "",
    a4: "",
    a5: "",
    a6: "",
    a7: "",
    a8: "",
    a9: "",
    a10: "",
  });

  let [matchAnswerQuantity, setMatchAnswerQuantity] = useState<number>(0);

  let questionNumbers: Array<number> = [];

  const handleChangeAnswer = (answer: any, index: number) => {
    let keys = Object.keys(listCurrentAnswer);
    let updatedListCurrentAnswer: any = { ...listCurrentAnswer };
    updatedListCurrentAnswer[keys[index]] = answer;

    setListCurrentAnswer(updatedListCurrentAnswer);
    if (
      Object.keys(listRightAnswer)[index] === "a" + (index + 1) &&
      listRightAnswer["a" + (index + 1)] === answer
    ) {
      setMatchAnswerQuantity(matchAnswerQuantity + 1);
    }
  };
  console.log("listRightAnswer 56 ===>", listRightAnswer);

  const [listTestById, setListTestById] = useState<any>([]);
  const [ListTestByTestTableId, setListTestByTestTableId] = useState<any>([]);

  const loadListTests = async () => {
    let result = await axios.get(
      `http://localhost:5500/api/v1/tests/my_test/all`
    );
    let ListTestByTestTableId = result.data.data[0].filter(
      (e: any) => e.testTableId === +testTableType
    );
    let listTestById = result.data.data[0].filter(
      (e: any) => e.testId === +testId.charAt(0)
    );

    setListTestById(listTestById[0]);
    setListTestByTestTableId(ListTestByTestTableId);
  };

  useEffect(() => {
    loadListTests();
  }, []);

  const [listExs, setListExs] = useState<any>([]);

  const loadListExs = async () => {
    console.log("testId line 88 ====>", testId);
    try {
      let result = await axios.get(
        `http://localhost:5500/api/v1/tests/my_test/text_exs/${testId}`
      );
      console.log(result, "<---- line 85");

      setListExs(result.data.data[0]);
      setListRightAnswer({
        a1: result.data.data[0][0]?.rightAnswer,
        a2: result.data.data[0][1]?.rightAnswer,
        a3: result.data.data[0][2]?.rightAnswer,
        a4: result.data.data[0][3]?.rightAnswer,
        a5: result.data.data[0][4]?.rightAnswer,
        a6: result.data.data[0][5]?.rightAnswer,
        a7: result.data.data[0][6]?.rightAnswer,
        a8: result.data.data[0][7]?.rightAnswer,
        a9: result.data.data[0][8]?.rightAnswer,
        a10: result.data.data[0][9]?.rightAnswer,
      });
      console.log("result ====>", result);
    } catch (error) {
      console.log(error, "<---- line 101 ");
    }
  };

  useEffect(() => {
    loadListExs();
  }, []);

  for (let index = 1; index <= listExs?.length; index++) {
    questionNumbers.push(index);
  }

  const handleResult = () => {
    clickAudio.play();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowResult(true);
    console.log("listCurrentAnswer ===>", listCurrentAnswer);
    console.log("listRightAnswer 110 ===>", listRightAnswer);
  };

  console.log(matchAnswerQuantity);
  console.log(
    "(matchAnswerQuantity / listExs?.length) * 100 =====>",
    (matchAnswerQuantity / listExs?.length) * 100
  );

  return (
    <div className="test-detail-container">
      <div className="test-detail-left  animate__animated animate__fadeIn animate__slow ">
        {showResult === false ? (
          <>
            <div className="test-detail-header">{listTestById?.testName}</div>
            <div
              style={{
                color: "gray",
                fontSize: "18.5px",
                fontWeight: "700",
                margin: "15px 0",
              }}
            >
              Choose the correct answer:
            </div>
          </>
        ) : (
          <>
            <div className="test-detail-header">
              Chúc mừng bạn đã hoàn thành bài test!
            </div>
            <div className="test-detail-result">
              Kết quả {listTestById?.testName}
            </div>
            <div className="right-answer-container">
              <div className="right-answer-left">Số câu trả lời đúng</div>
              <div className="right-answer-right">
                {matchAnswerQuantity}/{listExs?.length}
              </div>
            </div>
            <a className="right-answer-detail" href="#0">
              Xem kết quả chi tiết
            </a>
            <hr />
            {(matchAnswerQuantity / listExs?.length) * 100 <= 30 ? (
              <div
                style={{ color: "red" }}
                className="right-answer-result-detail"
              >
                Vốn từ vựng IELTS của bạn còn Yếu 😱.
              </div>
            ) : (matchAnswerQuantity / listExs?.length) * 100 <= 50 ? (
              <div
                style={{ color: "orange" }}
                className="right-answer-result-detail"
              >
                Vốn từ vựng IELTS của bạn ở mức Trung Bình 😙.
              </div>
            ) : (matchAnswerQuantity / listExs?.length) * 100 <= 80 ? (
              <div
                style={{ color: "orange" }}
                className="right-answer-result-detail"
              >
                Vốn từ vựng IELTS của bạn ở mức Khá 😉.
              </div>
            ) : (
              <div
                style={{ color: "#58bd2f" }}
                className="right-answer-result-detail"
              >
                Vốn từ vựng IELTS của bạn Tốt thật! 😍.
              </div>
            )}
            <hr />
            <div className="test-detail-header">Kết quả chi tiết</div>
          </>
        )}

        {/* TEST BLOCK */}
        {listExs?.map((ex: any, index: number) => (
          <div key={index} id={`${index + 1}`} className="test-block">
            <div className="test-block-question">
              <div className="test-block-number">{index + 1}</div>
              <div>{ex.question}</div>
            </div>
            <div className="test-block-answers">
              <div
                onClick={
                  showResult === false
                    ? () => handleChangeAnswer(`${ex.answerOne}`, index)
                    : () => {}
                }
                className={
                  showResult === false
                    ? Object.keys(listCurrentAnswer)[index] ===
                        "a" + (index + 1) &&
                      listCurrentAnswer["a" + (index + 1)] === `${ex.answerOne}`
                      ? "test-answer-active"
                      : "test-answer"
                    : Object.keys(listRightAnswer)[index] ===
                        "a" + (index + 1) &&
                      `${ex.answerOne}` === listRightAnswer["a" + (index + 1)]
                    ? "test-answer-right"
                    : "test-answer-wrong"
                }
              >
                {ex.answerOne}
              </div>
              <div
                onClick={() => handleChangeAnswer(`${ex.answerTwo}`, index)}
                className={
                  showResult === false
                    ? Object.keys(listCurrentAnswer)[index] ===
                        "a" + (index + 1) &&
                      listCurrentAnswer["a" + (index + 1)] === `${ex.answerTwo}`
                      ? "test-answer-active"
                      : "test-answer"
                    : Object.keys(listRightAnswer)[index] ===
                        "a" + (index + 1) &&
                      `${ex.answerTwo}` === listRightAnswer["a" + (index + 1)]
                    ? "test-answer-right"
                    : "test-answer-wrong"
                }
              >
                {ex.answerTwo}
              </div>
              <div
                onClick={() => handleChangeAnswer(`${ex.answerThree}`, index)}
                className={
                  showResult === false
                    ? Object.keys(listCurrentAnswer)[index] ===
                        "a" + (index + 1) &&
                      listCurrentAnswer["a" + (index + 1)] ===
                        `${ex.answerThree}`
                      ? "test-answer-active"
                      : "test-answer"
                    : Object.keys(listRightAnswer)[index] ===
                        "a" + (index + 1) &&
                      `${ex.answerThree}` === listRightAnswer["a" + (index + 1)]
                    ? "test-answer-right"
                    : "test-answer-wrong"
                }
              >
                {ex.answerThree}
              </div>
            </div>
          </div>
        ))}

        {/* TEST BLOCK END*/}
        {showResult === false ? (
          <div onClick={handleResult} className="test-submit-container">
            <div className="test-submit">GỬI BÀI</div>
          </div>
        ) : (
          <div
            onClick={() => navigate(`/test/${testTableType}`)}
            className="test-submit-container"
          >
            <div className="test-submit">ĐẾN DANH SÁCH BÀI KIỂM TRA</div>
          </div>
        )}
      </div>
      <div className="test-detail-right">
        <div className="list-questions-container  animate__animated animate__rotateInDownRight animate__delay-1s">
          <div className="list-questions-header">Danh sách câu hỏi</div>
          <div className="list-questions-numbers">
            {questionNumbers.map((number, i) => (
              <a
                href={number === 1 ? `#` : `#${i}`}
                className={
                  showResult === false
                    ? Object.keys(listCurrentAnswer)[i] === "a" + (i + 1) &&
                      listCurrentAnswer["a" + (i + 1)] !== ""
                      ? "questions-number-active"
                      : "questions-number"
                    : Object.keys(listCurrentAnswer)[i] === "a" + (i + 1) &&
                      listCurrentAnswer["a" + (i + 1)] !== "" &&
                      Object.keys(listRightAnswer)[i] === "a" + (i + 1) &&
                      listCurrentAnswer["a" + (i + 1)] ===
                        listRightAnswer["a" + (i + 1)]
                    ? "questions-number-right"
                    : "questions-number-wrong"
                }
                key={i}
              >
                {number}
              </a>
            ))}
          </div>
        </div>
        <div className="list-tests-container  animate__animated animate__fadeInUp animate__delay-2s">
          <div className="list-tests-header">Danh sách đề thi</div>
          <div className="list-tests-boby">
            {ListTestByTestTableId?.map((test: any, i: number) => (
              <div
                className="list-tests-pages"
                onClick={() => (window.location.href = `${test.testId}`)}
                key={i}
              >
                {test.testName}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestDetail;
