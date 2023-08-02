import { useEffect, useState } from "react";
import "../css/Test.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Test() {
  let testTableType = window.location.href.split("/")[4];
  let navigate = useNavigate();
  console.log(testTableType);

  let clickAudio = new Audio("/audio/Click.mp3");

  const [showListTest, setShowListTest] = useState<boolean>(false);
  const [listTestTables, setListTestTables] = useState<any>([]);
  const [listTestIndex, setListTestIndex] = useState<number>(0);

  const loadListTestTables = async () => {
    let result = await axios.get(
      `http://localhost:5500/api/v1/tests/${testTableType}`
    );
    setListTestTables(result.data.data[0]);
  };

  useEffect(() => {
    loadListTestTables();
  }, []);

  const [listTests, setListTests] = useState<any>([]);

  const loadListTests = async () => {
    let result = await axios.get(
      `http://localhost:5500/api/v1/tests/my_test/all`
    );
    setListTests(result.data.data[0]);
  };

  useEffect(() => {
    loadListTests();
  }, []);

  console.log("listTests ===>", listTests);

  const handleShowListTest = (testTable: any) => {
    clickAudio.play();
    let newListTests = listTests.filter(
      (e: any) => e.testTableId === testTable?.testTableId
    );
    let listTestIndex = listTestTables.findIndex(
      (test: any) => test?.testTableId === testTable?.testTableId
    );
    setListTestIndex(listTestIndex);
    setListTests(newListTests);
    setShowListTest(true);
  };

  console.log("listTestIndex ====>", listTestIndex);

  return (
    <div className="test-container">
      <div className="test-header">
        Mochi Test - Kiểm tra từ vựng IELTS, TOEIC, THPTQG
      </div>
      <div className="test-subHeader">
        Lựa chọn bài test từ vựng phù hợp với nhu cầu của mình nhé!
      </div>
      <div className="list-test-container">
        {showListTest === false ? (
          <>
            {listTestTables.map((testTable: any, index: number) => (
              <div
                key={index}
                onClick={() => handleShowListTest(testTable)}
                className="test-submit-container"
              >
                <div style={{ fontSize: "25px" }} className="test-submit">
                  Nhấn vào để hiện danh sách {testTable?.testTableName}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {listTestTables
              ?.slice(listTestIndex, listTestIndex + 1)
              .map((testTable: any, index: number) => (
                <table
                  className="animate__animated animate__fadeInDown"
                  key={index}
                >
                  <thead>
                    <tr>
                      <td colSpan={2}>{testTable?.testTableName}</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {listTests?.slice(0, 2).map((e: any) => (
                        <>
                          {e?.testTableId === testTable?.testTableId ? (
                            <>
                              <td
                                onClick={() =>
                                  navigate(
                                    `/test/${testTableType}/${e?.testId}`
                                  )
                                }
                              >
                                {e?.testName}
                              </td>
                            </>
                          ) : (
                            <td style={{ border: "none" }}></td>
                          )}
                        </>
                      ))}
                    </tr>
                    <tr>
                      {listTests?.slice(2, 4).map((e: any) => (
                        <>
                          {e?.testTableId === testTable?.testTableId ? (
                            <>
                              <td
                                onClick={() =>
                                  navigate(
                                    `/test/${testTableType}/${e?.testId}`
                                  )
                                }
                              >
                                {e?.testName}
                              </td>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      ))}
                    </tr>
                    <tr>
                      {listTests?.slice(4, 6).map((e: any) => (
                        <>
                          {e?.testTableId === testTable?.testTableId ? (
                            <>
                              <td
                                onClick={() =>
                                  navigate(
                                    `/test/${testTableType}/${e?.testId}`
                                  )
                                }
                              >
                                {e?.testName}
                              </td>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      ))}
                    </tr>
                    <tr>
                      {listTests?.slice(6, 8).map((e: any) => (
                        <>
                          {e?.testTableId === testTable?.testTableId ? (
                            <>
                              <td
                                onClick={() =>
                                  navigate(
                                    `/test/${testTableType}/${e?.testId}`
                                  )
                                }
                              >
                                {e?.testName}
                              </td>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      ))}
                    </tr>
                    <tr>
                      {listTests?.slice(8, 10).map((e: any) => (
                        <>
                          {console.log(listTests, "<--- list test")}

                          {e?.testTableId === testTable?.testTableId ? (
                            <>
                              <td
                                onClick={() =>
                                  navigate(
                                    `/test/${testTableType}/${e?.testId}`
                                  )
                                }
                              >
                                {e?.testName}
                              </td>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      ))}
                    </tr>
                  </tbody>
                </table>
              ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Test;
