import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Modal,
  Row,
  Table,
  Form,
} from "react-bootstrap";
import AdminNavbar from "./AdminNavbar";
import "../css/AdminPage.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

interface ListTestTables {
  testTableId: number;
  testTableName: string;
  testTableType: number;
}

interface ListTests {
  testId: number;
  testName: string;
  testTableId: number;
}

interface ListExs {
  exId: number;
  question: string;
  answerOne: string;
  answerTwo: string;
  answerThree: string;
  answerFour: string;
  rightAnswer: string;
  testId: number;
}

function TestManagement() {
  const [listTestTables, setListTestTables] = useState<ListTestTables[]>([]);
  const [testTableType, setTestTableType] = useState<string>("1");
  // const [testTableId, setTestTableId] = useState<number>(0);
  const [listTests, setListTests] = useState<ListTests[]>([]);
  const [listTestById, setListTestById] = useState<ListTests[]>([]);
  const [listExs, setListExs] = useState<ListExs[]>([]);
  const [listExsById, setListExsById] = useState<ListExs[]>([]);

  // Hiện modal bài kiểm tra
  const [showAddTestTable, setShowAddTestTable] = useState<any>(false);
  const [showEditTestTable, setShowEditTestTable] = useState<any>(false);
  const [showTest, setShowTest] = useState<any>(false);
  const [showAddTest, setShowAddTest] = useState<any>(false);
  const [showEditTest, setShowEditTest] = useState<any>(false);
  const [showExs, setShowExs] = useState<any>(false);
  const [showAddEx, setShowAddEx] = useState<any>(false);
  const [showEditEx, setShowEditEx] = useState<any>(false);

  // Khởi tạo giá trị thêm chủ đề mới
  const [newTestTable, setNewTestTable] = useState<ListTestTables>({
    testTableId: 0,
    testTableName: "",
    testTableType: 0,
  });

  // Khởi tạo giá trị edit chủ đề
  const [editTestTable, setEditTestTable] = useState<ListTestTables>({
    testTableId: 0,
    testTableName: "",
    testTableType: 0,
  });

  // Khởi tạo giá trị thêm bài test mới
  const [newTest, setNewTest] = useState<ListTests>({
    testId: 0,
    testName: "",
    testTableId: 0,
  });

  // Khởi tạo giá trị thêm bài test mới
  const [editTest, setEditTest] = useState<ListTests>({
    testId: 0,
    testName: "",
    testTableId: 0,
  });

  // Khởi tạo giá trị thêm câu hỏi bài test mới
  const [newEx, setNewEx] = useState<ListExs>({
    exId: 0,
    question: "",
    answerOne: "",
    answerTwo: "",
    answerThree: "",
    answerFour: "",
    rightAnswer: "",
    testId: 0,
  });

  // Khởi tạo giá trị thêm thêm câu hỏi bài test mới
  const [editEx, setEditEx] = useState<ListExs>({
    exId: 0,
    question: "",
    answerOne: "",
    answerTwo: "",
    answerThree: "",
    answerFour: "",
    rightAnswer: "",
    testId: 0,
  });

  // Gọi api loại bài kiểm tra
  const loadListTestTables = async () => {
    let result = await axios.get(`http://localhost:5500/api/v1/tests`);
    setListTestTables(result.data.data[0]);
    setNewTestTable({
      ...newTestTable,
      testTableId:
        result.data.data[0][result.data.data[0]?.length - 1].testTableId + 1,
    });
  };

  useEffect(() => {
    loadListTestTables();
  }, []);

  // Gọi api bài kiểm tra
  const loadListTests = async () => {
    let result = await axios.get(
      `http://localhost:5500/api/v1/tests/my_test/all`
    );
    setListTests(result.data.data[0]);
    setNewTest({
      ...newTest,
      testId: result.data.data[0][result.data.data[0]?.length - 1].testId + 1,
    });
  };

  useEffect(() => {
    loadListTests();
  }, []);

  // Gọi api câu hỏi bài kiểm tra
  const loadListExs = async () => {
    let result = await axios.get(
      `http://localhost:5500/api/v1/tests/my_test/text_exs`
    );
    setListExs(result.data.data[0]);
    setNewEx({
      ...newEx,
      exId: result.data.data[0][result.data.data[0]?.length - 1].exId + 1,
    });
  };

  useEffect(() => {
    loadListExs();
  }, []);

  let listTestVocabulary = listTestTables.filter(
    (e: any) => e.testTableType === 1
  );

  let listTestListenning = listTestTables.filter(
    (e: any) => e.testTableType === 2
  );

  // Phân trang hiển thị bài kiểm tra từ vựng
  const itemsPerPage = 4;
  const totalPages = Math.ceil(listTestVocabulary.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedVocab = listTestVocabulary
    .sort((a, b) => b.testTableId - a.testTableId)
    .slice(startIndex, endIndex);
  const displayedListen = listTestListenning
    .sort((a, b) => b.testTableId - a.testTableId)
    .slice(startIndex, endIndex);

  // Hàm render bài kiểm tra
  const handleRenderTests = (testTableId: number) => {
    setShowTest(true);
    let listTestById = listTests.filter(
      (e: any) => e.testTableId === testTableId
    );
    setListTestById(listTestById);
    // setTestTableId(testTableId);
    setNewTest({
      ...newTest,
      testTableId: testTableId,
    });
  };

  // Hàm render câu hỏi bài kiểm tra
  const handleRenderExs = (testId: number) => {
    setShowTest(true);
    let listExsById = listExs.filter((e: any) => e.testId === testId);
    setListExsById(listExsById);
    // setTestTableId(testTableId);
    setNewEx({
      ...newEx,
      testId: testId,
    });
  };

  // Hàm thêm chủ đề bài test
  const handleAddTestTable = async () => {
    if (!newTestTable.testTableName || !newTestTable.testTableType) {
      toast.error("Nhập thiếu thông tin mất rồi!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    await axios
      .post(`http://localhost:5500/api/v1/tests`, newTestTable)
      .then()
      .catch((err) => console.log(err));

    setListTestTables([...listTestTables, newTestTable]);

    setNewTestTable({
      testTableId: newTestTable.testTableId + 1,
      testTableName: "",
      testTableType: 0,
    });

    toast.success("Thêm chủ đề thành công!", {
      position: toast.POSITION.TOP_RIGHT,
    });

    loadListTestTables();
    setShowAddTestTable(false);
  };

  // Hàm thêm bài test
  const handleAddTest = async () => {
    if (!newTest.testName) {
      toast.error("Nhập thiếu thông tin mất rồi!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    await axios
      .post(`http://localhost:5500/api/v1/tests/my_test/all`, newTest)
      .then()
      .catch((err) => console.log(err));

    setListTestById([...listTestById, newTest]);

    setNewTest({
      testId: newTest.testId + 1,
      testName: "",
      testTableId: newTest.testTableId,
    });

    toast.success("Thêm bài test thành công!", {
      position: toast.POSITION.TOP_RIGHT,
    });

    loadListTests();
    setShowAddTest(false);
  };

  // Hàm thêm bài test
  const handleAddEx = async () => {
    if (
      !newEx.question ||
      !newEx.answerOne ||
      !newEx.answerTwo ||
      !newEx.answerThree ||
      !newEx.rightAnswer
    ) {
      toast.error("Nhập thiếu thông tin mất rồi!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    await axios
      .post(`http://localhost:5500/api/v1/tests/my_test/text_exs`, newEx)
      .then()
      .catch((err) => console.log(err));

    setListExsById([...listExsById, newEx]);
    setNewEx({
      exId: newEx.exId + 1,
      question: "",
      answerOne: "",
      answerTwo: "",
      answerThree: "",
      answerFour: "",
      rightAnswer: "",
      testId: newEx.testId,
    });
    toast.success("Thêm câu hỏi thành công!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    loadListExs();
    setShowAddEx(false);
  };

  console.log(newEx);

  return (
    <Container className="admin-page-big-container">
      <Row>
        <div className="admin-page-container">
          <AdminNavbar />
          <Col md={8}>
            <div className="management">
              <div className="management-title ">QUẢN LÝ BÀI TEST</div>
              <div className="management-add-search">
                <div
                  style={{
                    margin: "0px",
                    fontWeight: "bolder",
                  }}
                  className="home-wrap-button-contain"
                  onClick={() => setShowAddTestTable(true)}
                >
                  <div style={{ padding: "5px" }} className="home-wrap-button">
                    + Thêm chủ đề
                  </div>
                </div>
                {/* SEARCH */}
                <div className="management-search">
                  <input type="text" placeholder="Tìm kiếm khóa học..." />
                  <img src="/img/logo/search.svg" alt="" />
                </div>
                {/* SEARCH END*/}
              </div>
              <div className="render-test-container">
                <div className="render-test-block  animate__animated animate__slow animate__fadeInDown">
                  {testTableType === "1" ? (
                    <div className="render-test-header">TEST TỪ VỰNG</div>
                  ) : (
                    <div className="render-test-header">TEST BÀI NGHE</div>
                  )}

                  <div className="render-test-body">
                    {/* RENDER TEST BODY BLOCK  */}
                    {testTableType === "1"
                      ? displayedVocab?.map((vocab: any, i: number) => (
                          <div key={i} className="render-test-body-block">
                            <div className="test-table-name">
                              {vocab?.testTableName}
                            </div>
                            <div className="render-test-body-func">
                              <div
                                style={{ fontSize: "18px" }}
                                className="show-detail"
                                onClick={() =>
                                  handleRenderTests(vocab?.testTableId)
                                }
                              >
                                Xem chi tiết
                              </div>
                              <div
                                onClick={() => {
                                  setShowEditTestTable(true);
                                  setEditTestTable(vocab);
                                }}
                                className="ql-icon"
                              >
                                <img src="/img/logo/edit.png" alt="" />
                              </div>
                              <div className="ql-icon">
                                <img src="/img/logo/delete.png" alt="" />
                              </div>
                            </div>
                          </div>
                        ))
                      : displayedListen?.map((listen: any, i: number) => (
                          <div key={i} className="render-test-body-block">
                            <div className="test-table-name">
                              {listen?.testTableName}
                            </div>
                            <div className="render-test-body-func">
                              <div
                                style={{ fontSize: "18px" }}
                                className="show-detail"
                                onClick={() =>
                                  handleRenderTests(listen?.testTableId)
                                }
                              >
                                Xem chi tiết
                              </div>
                              <div
                                onClick={() => {
                                  setShowEditTestTable(true);
                                  setEditTestTable(listen);
                                }}
                                className="ql-icon"
                              >
                                <img src="/img/logo/edit.png" alt="" />
                              </div>
                              <div className="ql-icon">
                                <img src="/img/logo/delete.png" alt="" />
                              </div>
                            </div>
                          </div>
                        ))}
                    {/* RENDER TEST BODY BLOCK END */}
                  </div>
                </div>
              </div>
            </div>
            <div></div>
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
            <div className="select-test-container">
              <select
                onChange={(e: any) => setTestTableType(e.target.value)}
                className="select-test"
              >
                <option value="1">Kiểm Tra Từ Vựng</option>
                <option value="2">Kiểm Tra Bài Nghe</option>
                {/* <option value="3">Kiểm Tra Bài Đọc</option> */}
              </select>
            </div>
          </Col>
        </div>
      </Row>

      {/* Add TestTable Modal */}
      <Modal
        className="add-post-modal"
        size="lg"
        backdrop="static"
        show={showAddTestTable}
        onHide={() => setShowAddTestTable(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowAddTestTable(false)}
                src="/img/logo/close.svg"
                alt=""
              />
            </div>
            <div
              className="list-course-modal-title-text"
              style={{ fontSize: "25px" }}
            >
              THÊM CHỦ ĐỀ
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form className="add-course-container">
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Tên chủ đề</label>
                <Form.Control
                  type="text"
                  value={newTestTable.testTableName}
                  onChange={(e) =>
                    setNewTestTable({
                      ...newTestTable,
                      testTableName: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formGridState">
                <label>Thể loại</label>
                <Form.Select
                  defaultValue="Chọn thể loại..."
                  value={newTestTable.testTableType}
                  onChange={(e) =>
                    setNewTestTable({
                      ...newTestTable,
                      testTableType: +e.target.value,
                    })
                  }
                >
                  <option value={0}>Chọn thể loại...</option>
                  <option value={1}>Từ Vựng</option>
                  <option value={2}>Nghe</option>
                </Form.Select>
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontWeight: "bolder" }}
            variant="warning"
            onClick={handleAddTestTable}
          >
            + Thêm chủ đề
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Add TestTable Modal End*/}

      {/* Edit TestTable Modal */}
      <Modal
        className="add-post-modal"
        size="lg"
        backdrop="static"
        show={showEditTestTable}
        onHide={() => setShowEditTestTable(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowEditTestTable(false)}
                src="/img/logo/close.svg"
                alt=""
              />
            </div>
            <div
              className="list-course-modal-title-text"
              style={{ fontSize: "25px" }}
            >
              CHỈNH SỬA CHỦ ĐỀ
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form className="add-course-container">
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Tên chủ đề</label>
                <Form.Control
                  type="text"
                  value={editTestTable.testTableName}
                  onChange={(e) =>
                    setEditTestTable({
                      ...editTestTable,
                      testTableName: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formGridState">
                <label>Thể loại</label>
                <Form.Select
                  defaultValue="Chọn thể loại..."
                  value={editTestTable.testTableType}
                  onChange={(e) =>
                    setEditTestTable({
                      ...editTestTable,
                      testTableType: +e.target.value,
                    })
                  }
                >
                  <option value={0}>Chọn thể loại...</option>
                  <option value={1}>Từ Vựng</option>
                  <option value={2}>Nghe</option>
                </Form.Select>
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontWeight: "bolder" }}
            variant="warning"
            onClick={handleAddTestTable}
          >
            + Sửa chủ đề
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit TestTable Modal End*/}

      {/* Show Test Modal */}
      <Modal
        className="add-post-modal"
        backdrop="static"
        show={showTest}
        onHide={() => setShowTest(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowTest(false)}
                src="/img/logo/close.svg"
                alt=""
              />
            </div>
            <div
              className="list-course-modal-title-text"
              style={{ fontSize: "25px" }}
            >
              DANH SÁCH BÀI KIỂM TRA
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              margin: "0px",
              fontWeight: "bolder",
            }}
            className="home-wrap-button-contain"
            onClick={() => setShowAddTest(true)}
          >
            <div style={{ padding: "5px" }} className="home-wrap-button">
              + Thêm bài kiểm tra
            </div>
          </div>
          <Table className="table-container" striped bordered>
            <thead>
              <tr>
                <th>ID</th>
                <th>TÊN BÀI KIỂM TRA</th>
                <th>CHI TIẾT</th>
                <th colSpan={2}>SỬA / XÓA</th>
              </tr>
            </thead>
            <tbody>
              {listTestById
                .sort((a: any, b: any) => b.testId - a.testId)
                ?.map((test: any, index: number) => (
                  <tr key={index}>
                    <td>{test?.testId}</td>
                    <td>{test?.testName}</td>
                    <td
                      onClick={() => {
                        setShowExs(true);
                        handleRenderExs(test?.testId);
                      }}
                    >
                      <div className="show-detail">Xem chi tiết</div>
                    </td>
                    <td
                      onClick={() => {
                        setShowEditTest(true);
                        setEditTest(test);
                      }}
                    >
                      <div className="ql-icon">
                        <img src="/img/logo/edit.png" alt="" />
                      </div>
                    </td>
                    <td>
                      <div className="ql-icon">
                        <img src="/img/logo/delete.png" alt="" />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
      {/* Show Test Modal End*/}

      {/* Add Test Modal */}
      <Modal
        className="add-post-modal"
        size="lg"
        backdrop="static"
        show={showAddTest}
        onHide={() => setShowAddTest(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowAddTest(false)}
                src="/img/logo/close.svg"
                alt=""
              />
            </div>
            <div
              className="list-course-modal-title-text"
              style={{ fontSize: "25px" }}
            >
              THÊM BÀI KIỂM TRA
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form className="add-course-container">
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Tên bài kiểm tra</label>
                <Form.Control
                  type="text"
                  value={newTest.testName}
                  onChange={(e) =>
                    setNewTest({
                      ...newTest,
                      testName: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontWeight: "bolder" }}
            variant="warning"
            onClick={handleAddTest}
          >
            + Thêm bài kiểm tra
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Add Test Modal End*/}

      {/* Edit Test Modal */}
      <Modal
        className="add-post-modal"
        size="lg"
        backdrop="static"
        show={showEditTest}
        onHide={() => setShowEditTest(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowEditTest(false)}
                src="/img/logo/close.svg"
                alt=""
              />
            </div>
            <div
              className="list-course-modal-title-text"
              style={{ fontSize: "25px" }}
            >
              CHỈNH SỬA BÀI KIỂM TRA
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form className="add-course-container">
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Tên bài kiểm tra</label>
                <Form.Control
                  type="text"
                  value={editTest.testName}
                  onChange={(e) =>
                    setNewTest({
                      ...editTest,
                      testName: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontWeight: "bolder" }}
            variant="warning"
            // onClick={handleAddTest}
          >
            + Sửa bài kiểm tra
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit Test Modal End*/}

      {/* Show Ex Modal */}
      <Modal
        className="add-post-modal"
        size="lg"
        backdrop="static"
        show={showExs}
        onHide={() => setShowExs(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowExs(false)}
                src="/img/logo/close.svg"
                alt=""
              />
            </div>
            <div
              className="list-course-modal-title-text"
              style={{ fontSize: "25px" }}
            >
              DANH SÁCH CÂU HỎI
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              margin: "0px",
              fontWeight: "bolder",
            }}
            className="home-wrap-button-contain"
            onClick={() => setShowAddEx(true)}
          >
            <div style={{ padding: "5px" }} className="home-wrap-button">
              + Thêm câu hỏi
            </div>
          </div>
          <Table className="table-container" striped bordered>
            <thead>
              <tr>
                <th>ID</th>
                <th>CÂU HỎI</th>
                <th>CÂU 1</th>
                <th>CÂU 2</th>
                <th>CÂU 3</th>
                <th>CÂU TRẢ LỜI ĐÚNG</th>
                <th colSpan={2}>SỬA / XÓA</th>
              </tr>
            </thead>
            <tbody>
              {listExsById
                .sort((a: any, b: any) => b.exId - a.exId)
                ?.map((ex: any, index: number) => (
                  <tr key={index}>
                    <td>{ex?.exId}</td>
                    <td>{ex?.question}</td>
                    <td>{ex?.answerOne}</td>
                    <td>{ex?.answerTwo}</td>
                    <td>{ex?.answerThree}</td>
                    <td>{ex?.rightAnswer}</td>
                    <td
                      onClick={() => {
                        setShowEditEx(true);
                        setEditEx(ex);
                      }}
                    >
                      <div className="ql-icon">
                        <img src="/img/logo/edit.png" alt="" />
                      </div>
                    </td>
                    <td>
                      <div className="ql-icon">
                        <img src="/img/logo/delete.png" alt="" />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
      {/* Show Ex Modal End*/}

      {/* Add EX Modal */}
      <Modal
        className="add-post-modal"
        size="lg"
        backdrop="static"
        show={showAddEx}
        onHide={() => setShowAddEx(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowAddEx(false)}
                src="/img/logo/close.svg"
                alt=""
              />
            </div>
            <div
              className="list-course-modal-title-text"
              style={{ fontSize: "25px" }}
            >
              THÊM CÂU HỎI
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form className="add-course-container">
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Câu hỏi: </label>
                <Form.Control
                  type="text"
                  value={newEx.question}
                  onChange={(e) =>
                    setNewEx({
                      ...newEx,
                      question: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Câu trả lời 1: </label>
                <Form.Control
                  type="text"
                  value={newEx.answerOne}
                  onChange={(e) =>
                    setNewEx({
                      ...newEx,
                      answerOne: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Câu trả lời 2: </label>
                <Form.Control
                  type="text"
                  value={newEx.answerTwo}
                  onChange={(e) =>
                    setNewEx({
                      ...newEx,
                      answerTwo: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Câu trả lời 3: </label>
                <Form.Control
                  type="text"
                  value={newEx.answerThree}
                  onChange={(e) =>
                    setNewEx({
                      ...newEx,
                      answerThree: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Câu trả lời 4: </label>
                <Form.Control
                  type="text"
                  value={newEx.answerFour}
                  onChange={(e) =>
                    setNewEx({
                      ...newEx,
                      answerFour: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Câu trả lời đúng: </label>
                <Form.Control
                  type="text"
                  value={newEx.rightAnswer}
                  onChange={(e) =>
                    setNewEx({
                      ...newEx,
                      rightAnswer: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontWeight: "bolder" }}
            variant="warning"
            onClick={handleAddEx}
          >
            + Thêm câu hỏi
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Add Ex Modal End*/}

      {/* Edit Ex Modal */}
      <Modal
        className="add-post-modal"
        size="lg"
        backdrop="static"
        show={showEditEx}
        onHide={() => setShowEditEx(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowEditEx(false)}
                src="/img/logo/close.svg"
                alt=""
              />
            </div>
            <div
              className="list-course-modal-title-text"
              style={{ fontSize: "25px" }}
            >
              CHỈNH SỬA CÂU HỎI
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form className="add-course-container">
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Câu hỏi: </label>
                <Form.Control
                  type="text"
                  value={editEx.question}
                  onChange={(e) =>
                    setEditEx({
                      ...editEx,
                      question: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Câu trả lời 1: </label>
                <Form.Control
                  type="text"
                  value={editEx.answerOne}
                  onChange={(e) =>
                    setEditEx({
                      ...editEx,
                      answerOne: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Câu trả lời 2: </label>
                <Form.Control
                  type="text"
                  value={editEx.answerTwo}
                  onChange={(e) =>
                    setEditEx({
                      ...editEx,
                      answerTwo: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Câu trả lời 3: </label>
                <Form.Control
                  type="text"
                  value={editEx.answerThree}
                  onChange={(e) =>
                    setEditEx({
                      ...editEx,
                      answerThree: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Câu trả lời 4: </label>
                <Form.Control
                  type="text"
                  value={editEx.answerFour}
                  onChange={(e) =>
                    setEditEx({
                      ...editEx,
                      answerFour: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Câu trả lời đúng: </label>
                <Form.Control
                  type="text"
                  value={editEx.rightAnswer}
                  onChange={(e) =>
                    setEditEx({
                      ...editEx,
                      rightAnswer: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontWeight: "bolder" }}
            variant="warning"
            // onClick={handleAddTest}
          >
            + Sửa câu hỏi
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit Ex Modal End*/}

      <ToastContainer autoClose={1500} />
    </Container>
  );
}

export default TestManagement;
