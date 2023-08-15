import { useEffect, useState } from "react";
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
import Loading from "../../layouts/html/Loading";
import debounce from "lodash.debounce";

interface ListTestTables {
  testTableId: number;
  testTableName: string;
  testTableType: number;
}

interface ListTests {
  testId: number;
  testName: string;
  testEssay: string;
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
  const [loading, setLoading] = useState(false);
  const [listTestTables, setListTestTables] = useState<ListTestTables[]>([]);
  const [testTableType, setTestTableType] = useState<string>("1");
  // const [testTableId, setTestTableId] = useState<number>(0);
  const [listTests, setListTests] = useState<ListTests[]>([]);
  const [listTestById, setListTestById] = useState<ListTests[]>([]);
  const [listExs, setListExs] = useState<ListExs[]>([]);
  const [listExsById, setListExsById] = useState<ListExs[]>([]);

  // Hiện modal
  const [showAddTestTable, setShowAddTestTable] = useState<any>(false);
  const [showEditTestTable, setShowEditTestTable] = useState<any>(false);
  const [showTest, setShowTest] = useState<any>(false);
  const [showAddTest, setShowAddTest] = useState<any>(false);
  const [showAddReadingTest, setShowAddReadingTest] = useState<any>(false);
  const [showEditReadingTest, setShowEditReadingTest] = useState<any>(false);
  const [showEditTest, setShowEditTest] = useState<any>(false);
  const [showExs, setShowExs] = useState<any>(false);
  const [showAddEx, setShowAddEx] = useState<any>(false);
  const [showEditEx, setShowEditEx] = useState<any>(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEssay, setShowEssay] = useState(false);
  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  // Khởi tạo index cần edit
  const [editTestIndex, setEditTestIndex] = useState<number>(0);
  const [editExIndex, setEditExIndex] = useState<number>(0);

  // Khởi tạo id và index cần xóa
  const [deleteTestTableId, setDeleteTestTableId] = useState<number>(0);
  const [deleteTestTableIndex, setDeleteTestTableIndex] = useState<number>(0);
  const [deleteTestId, setDeleteTestId] = useState<number>(0);
  const [deleteTestIndex, setDeleteTestIndex] = useState<number>(0);
  const [deleteTestExId, setDeleteTestExId] = useState<number>(0);
  const [deleteTestExIndex, setDeleteTestExIndex] = useState<number>(0);

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
    testEssay: "",
    testTableId: 0,
  });

  // Khởi tạo giá trị thêm bài test mới
  const [editTest, setEditTest] = useState<ListTests>({
    testId: 0,
    testName: "",
    testEssay: "",
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

  // Giá trị tìm kiếm
  const [searchTestTableValue, setSearchTestTableValue] = useState<string>("");
  const searchValue = searchTestTableValue.trim();

  // Thông tin bài đọc
  const [essay, setEssay] = useState<string>("");

  // Gọi api loại bài kiểm tra
  const loadListTestTables = () => {
    setLoading(true);
    setTimeout(() => {
      axios
        .get(
          `http://localhost:5550/api/v1/test_tables/search?searchValue=${searchValue}`
        )
        .then((res) => {
          setListTestTables(res.data);
          setNewTestTable({
            ...newTestTable,
            testTableId: res.data[res.data?.length - 1].testTableId + 1,
            testTableName: "",
            testTableType: 0,
          });
        })
        .catch((err) => console.log(err));
      setLoading(false);
    }, 950);
  };

  useEffect(() => {
    const delayedSearch = debounce(loadListTestTables, 1000); // Đặt thời gian debounce là 500ms
    delayedSearch();
    return delayedSearch.cancel; // Hủy debounce khi component bị hủy
  }, [searchValue]);

  // Gọi api bài kiểm tra
  const loadListTests = async () => {
    let result = await axios.get(`http://localhost:5550/api/v1/tests`);
    setListTests(result.data);
    setNewTest({
      ...newTest,
      testId: result.data[result.data?.length - 1].testId + 1,
      testName: "",
      testTableId: 0,
    });
  };

  useEffect(() => {
    loadListTests();
  }, []);

  // Gọi api câu hỏi bài kiểm tra
  const loadListExs = async () => {
    let result = await axios.get(`http://localhost:5550/api/v1/test_exs`);
    setListExs(result.data);
    setNewEx({
      ...newEx,
      exId: result.data[result.data?.length - 1].exId + 1,
      question: "",
      answerOne: "",
      answerTwo: "",
      answerThree: "",
      answerFour: "",
      rightAnswer: "",
    });
  };

  useEffect(() => {
    loadListExs();
  }, []);

  let listTestVocabulary = listTestTables.filter(
    (e: any) => e.testTableType === 1
  );

  let listTestReading = listTestTables.filter(
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
  const displayedListen = listTestReading
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
      .post(`http://localhost:5550/api/v1/test_tables`, newTestTable)
      .then((res) => {
        setListTestTables([...listTestTables, newTestTable]);

        toast.success(`${res.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });

        loadListTestTables();
        setShowAddTestTable(false);
      })
      .catch((err) => {
        toast.warning(`${err.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  // Hàm edit khóa học
  const handleEditTestTable = async () => {
    const updatedTestTable = listTestTables.filter((testTable) =>
      testTable.testTableId === testTable.testTableId
        ? editTestTable
        : testTable
    );
    setListTestTables(updatedTestTable);
    await axios
      .patch(
        `http://localhost:5550/api/v1/test_tables/${editTestTable.testTableId}`,
        editTestTable
      )
      .then(() => {
        toast.success(`Thay đổi nội dung thành công! 🍀`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setShowEditTestTable(false);
        loadListTestTables();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Hàm xóa chủ đề bài test
  const handleDeleteTestTable = async () => {
    await axios.delete(
      `http://localhost:5550/api/v1/test_tables/${deleteTestTableId}`
    );
    toast.success("Xóa chủ đề thành công! 🍀", {
      position: toast.POSITION.TOP_RIGHT,
    });
    listTestTables.splice(deleteTestTableIndex, 1);
    setShowConfirm(false);
    loadListTestTables();
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
      .post(`http://localhost:5550/api/v1/tests`, newTest)
      .then((res) => {
        setListTestById([...listTestById, newTest]);

        toast.success(`${res.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setNewTest({
          ...newTest,
          testId: newTest.testId + 1,
          testName: "",
          testEssay: "",
          testTableId: newTest.testTableId,
        });
        listTestById.push(newTest);
        setShowAddTest(false);
        setShowAddReadingTest(false);
      })
      .catch((err) => {
        toast.warning(`${err.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  // Hàm edit bài test
  const handleEditTest = async () => {
    const updatedTest = listTests.filter((test) =>
      test.testId === test.testId ? editTest : test
    );
    setListTests(updatedTest);
    await axios
      .patch(`http://localhost:5550/api/v1/tests/${editTest.testId}`, editTest)
      .then((res) => {
        console.log(res);

        toast.success(`Thay đổi nội dung thành công! 🍀`, {
          position: toast.POSITION.TOP_RIGHT,
        });

        setShowEditTest(false);
        setShowEditReadingTest(false);
        listTestById.splice(editTestIndex, 1, editTest);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Hàm xóa bài test
  const handleDeleteTest = async () => {
    await axios.delete(`http://localhost:5550/api/v1/tests/${deleteTestId}`);
    toast.success("Xóa chủ đề thành công! 🍀", {
      position: toast.POSITION.TOP_RIGHT,
    });
    listTestById.splice(deleteTestIndex, 1);
    setShowConfirm(false);
    loadListTests();
  };

  // Hàm thêm câu hỏi
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
      .post(`http://localhost:5550/api/v1/test_exs`, newEx)
      .then((res) => {
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

        toast.success(`${res.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        listExsById.push(newEx);
        loadListExs();
        setShowAddEx(false);
      })
      .catch((err) => {
        toast.warning(`${err.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  // Hàm edit câu hỏi
  const handleEditEx = async () => {
    const updatedEx = listExs.filter((ex) =>
      ex.exId === ex.exId ? editEx : ex
    );
    setListExs(updatedEx);
    await axios
      .patch(`http://localhost:5550/api/v1/test_exs/${editEx.exId}`, editEx)
      .then((res) => {
        toast.success(`${res.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });

        setShowEditEx(false);
        listExsById.splice(editExIndex, 1, editEx);
      })
      .catch((err) => {
        toast.warning(`${err.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  // Hàm xóa câu hỏi
  const handleDeleteEx = async () => {
    await axios.delete(
      `http://localhost:5550/api/v1/test_exs/${deleteTestExId}`
    );
    toast.success("Xóa câu hỏi thành công! 🍀", {
      position: toast.POSITION.TOP_RIGHT,
    });
    listExsById.splice(deleteTestExIndex, 1);
    loadListExs();
    setShowConfirm(false);
  };

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
                  <input
                    onChange={(e: any) =>
                      setSearchTestTableValue(e.target.value)
                    }
                    value={searchTestTableValue}
                    type="text"
                    placeholder="Tìm kiếm chủ đề bài test..."
                  />
                  <img src="/img/logo/search.svg" alt="" />
                </div>
                {/* SEARCH END*/}
              </div>
              <div className="render-test-container">
                <div className="render-test-block  animate__animated animate__slow animate__fadeInDown">
                  {testTableType === "1" ? (
                    <div className="render-test-header">TEST TỪ VỰNG</div>
                  ) : (
                    <div className="render-test-header">TEST BÀI ĐỌC</div>
                  )}

                  <div className="render-test-body">
                    {/* RENDER TEST BODY BLOCK  */}
                    {testTableType === "1"
                      ? displayedVocab?.map((vocab: any, index: number) => (
                          <div key={index} className="render-test-body-block">
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
                              <div
                                onClick={() => {
                                  setDeleteTestTableId(vocab?.testTableId);
                                  setDeleteTestTableIndex(index);
                                  setShowConfirm(true);
                                }}
                                className="ql-icon"
                              >
                                <img src="/img/logo/delete.png" alt="" />
                              </div>
                            </div>
                          </div>
                        ))
                      : displayedListen?.map((listen: any, index: number) => (
                          <div key={index} className="render-test-body-block">
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
                              <div
                                onClick={() => {
                                  setDeleteTestTableId(listen?.testTableId);
                                  setDeleteTestTableIndex(index);
                                  setShowConfirm(true);
                                }}
                                className="ql-icon"
                              >
                                <img src="/img/logo/delete.png" alt="" />
                              </div>
                            </div>
                          </div>
                        ))}

                    {/* RENDER TEST BODY BLOCK END */}
                  </div>
                </div>
              </div>
              {loading ? <Loading /> : <></>}
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
                <option value="2">Kiểm Tra Bài Đọc</option>
                {/* <option value="3">Kiểm Tra Bài Nghe</option> */}
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
                  placeholder="Nhập tên chủ đề (Vd: Test Từ Vựng IELTS)"
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
                  <option value={2}>Đọc Hiểu</option>
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
            onClick={handleEditTestTable}
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
        size={"lg"}
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
        {testTableType === "1" ? (
          <>
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
                    <th>STT</th>
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
                        <td>{index + 1}</td>
                        <td>{test?.testName}</td>
                        <td
                          onClick={() => {
                            setShowExs(true);
                            handleRenderExs(test?.testId);
                          }}
                        >
                          <div className="show-detail">Xem chi tiết</div>
                        </td>
                        <td>
                          <div
                            onClick={() => {
                              setShowEditTest(true);
                              setEditTest(test);
                              setEditTestIndex(index);
                            }}
                            className="ql-icon"
                          >
                            <img src="/img/logo/edit.png" alt="" />
                          </div>
                        </td>
                        <td>
                          <div
                            onClick={() => {
                              setDeleteTestId(test?.testId);
                              setDeleteTestIndex(index);
                              setShowConfirm(true);
                            }}
                            className="ql-icon"
                          >
                            <img src="/img/logo/delete.png" alt="" />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Modal.Body>
          </>
        ) : (
          <>
            <Modal.Body>
              <div
                style={{
                  margin: "0px",
                  fontWeight: "bolder",
                }}
                className="home-wrap-button-contain"
                onClick={() => setShowAddReadingTest(true)}
              >
                <div style={{ padding: "5px" }} className="home-wrap-button">
                  + Thêm bài kiểm tra
                </div>
              </div>
              <Table className="table-container" striped bordered>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>TÊN BÀI KIỂM TRA</th>
                    <th>ĐOẠN VĂN ĐỌC HIỂU</th>
                    <th>CHI TIẾT</th>
                    <th colSpan={2}>SỬA / XÓA</th>
                  </tr>
                </thead>
                <tbody>
                  {listTestById
                    .sort((a: any, b: any) => b.testId - a.testId)
                    ?.map((test: any, index: number) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{test?.testName}</td>
                        <td
                          onClick={() => {
                            setShowEssay(true);
                            setEssay(test?.testEssay);
                          }}
                        >
                          <div className="show-detail">Hiện bài đọc</div>
                        </td>
                        <td
                          onClick={() => {
                            setShowExs(true);
                            handleRenderExs(test?.testId);
                          }}
                        >
                          <div className="show-detail">Xem chi tiết</div>
                        </td>
                        <td>
                          <div
                            onClick={() => {
                              setShowEditReadingTest(true);
                              setEditTest(test);
                              setEditTestIndex(index);
                            }}
                            className="ql-icon"
                          >
                            <img src="/img/logo/edit.png" alt="" />
                          </div>
                        </td>
                        <td>
                          <div
                            onClick={() => {
                              setDeleteTestId(test?.testId);
                              setDeleteTestIndex(index);
                              setShowConfirm(true);
                            }}
                            className="ql-icon"
                          >
                            <img src="/img/logo/delete.png" alt="" />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Modal.Body>
          </>
        )}
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
              THÊM BÀI KIỂM TRA TỪ VỰNG
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
                  placeholder="Nhập tên bài kiểm tra (Vd: Test từ vựng IELTS 01)"
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

      {/* Add Reading Test Modal */}
      <Modal
        className="add-post-modal"
        size="lg"
        backdrop="static"
        show={showAddReadingTest}
        onHide={() => setShowAddReadingTest(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowAddReadingTest(false)}
                src="/img/logo/close.svg"
                alt=""
              />
            </div>
            <div
              className="list-course-modal-title-text"
              style={{ fontSize: "25px" }}
            >
              THÊM BÀI KIỂM TRA ĐỌC HIỂU
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
                  placeholder="Nhập tên bài kiểm tra: (Vd: Test từ vựng IELTS 01)"
                  onChange={(e) =>
                    setNewTest({
                      ...newTest,
                      testName: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group>
                <Form.Label>Đoạn văn đọc hiểu</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  placeholder="Nhập đoạn văn đọc hiểu: (Vd: Martin Luther King was born on January 15, 1929, in Atlanta, Georgia. He was the son of the Reverend Martin Luther King, Sr. and Alberta Williams King. He had an older sister, Willie Christine King, and a younger brother Alfred Daniel Williams King. Growing up in Atlanta, King attended Booker T. Washington High School. He skipped ninth and twelfth grades and entered Morehouse College at age fifteen without formally graduating from high school.)"
                  value={newTest.testEssay}
                  onChange={(e) =>
                    setNewTest({ ...newTest, testEssay: e.target.value })
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
      {/*  Add Reading Test Modal */}

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
                    setEditTest({
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
            onClick={handleEditTest}
          >
            + Sửa bài kiểm tra
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit Test Modal End*/}

      {/* Edit Reading Test Modal */}
      <Modal
        className="add-post-modal"
        size="lg"
        backdrop="static"
        show={showEditReadingTest}
        onHide={() => setShowEditReadingTest(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowEditReadingTest(false)}
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
                    setEditTest({
                      ...editTest,
                      testName: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group>
                <Form.Label>Đoạn văn đọc hiểu</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  placeholder="Nhập đoạn văn đọc hiểu: (Vd: Martin Luther King was born on January 15, 1929, in Atlanta, Georgia. He was the son of the Reverend Martin Luther King, Sr. and Alberta Williams King. He had an older sister, Willie Christine King, and a younger brother Alfred Daniel Williams King. Growing up in Atlanta, King attended Booker T. Washington High School. He skipped ninth and twelfth grades and entered Morehouse College at age fifteen without formally graduating from high school.)"
                  value={editTest.testEssay}
                  onChange={(e) =>
                    setEditTest({ ...editTest, testEssay: e.target.value })
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
            onClick={handleEditTest}
          >
            + Sửa bài kiểm tra
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit Reading Test Modal End*/}

      {/* Show Essay Modal */}
      <Modal
        className="add-post-modal"
        size="lg"
        backdrop="static"
        show={showEssay}
        onHide={() => setShowEssay(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowEssay(false)}
                src="/img/logo/close.svg"
                alt=""
              />
            </div>
            <div
              className="list-course-modal-title-text"
              style={{ fontSize: "25px" }}
            >
              BÀI ĐỌC HIỂU
            </div>
          </div>
        </Modal.Header>
        <Modal.Body style={{ fontWeight: "bolder", padding: "25px" }}>
          {essay}
        </Modal.Body>
      </Modal>
      {/* Show Essay Modal End*/}

      {/* Show Ex Modal */}
      <Modal
        className="add-post-modal"
        size="xl"
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
                <th>STT</th>
                <th>CÂU HỎI</th>
                <th>CÂU 1</th>
                <th>CÂU 2</th>
                <th>CÂU 3</th>
                <th>CÂU 4</th>
                <th>CÂU TRẢ LỜI ĐÚNG</th>
                <th colSpan={2}>SỬA / XÓA</th>
              </tr>
            </thead>
            <tbody>
              {listExsById
                .sort((a: any, b: any) => b.exId - a.exId)
                ?.map((ex: any, index: number) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{ex?.question}</td>
                    <td>{ex?.answerOne}</td>
                    <td>{ex?.answerTwo}</td>
                    <td>{ex?.answerThree}</td>
                    <td>
                      {ex?.answerFour === null || ex?.answerFour === ""
                        ? "Không có"
                        : ex?.answerFour}
                    </td>
                    <td>{ex?.rightAnswer}</td>
                    <td>
                      <div
                        onClick={() => {
                          setShowEditEx(true);
                          setEditEx(ex);
                          setEditExIndex(index);
                        }}
                        className="ql-icon"
                      >
                        <img src="/img/logo/edit.png" alt="" />
                      </div>
                    </td>
                    <td>
                      <div
                        onClick={() => {
                          setDeleteTestExId(ex?.exId);
                          setDeleteTestExIndex(index);
                          setShowConfirm(true);
                        }}
                        className="ql-icon"
                      >
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
                  placeholder="Nhập câu hỏi: (Vd: To __________ over something is to feel or express worry or annoyance.)"
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
                  placeholder="Nhập trả lời 1: (Vd: Fret)"
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
                  placeholder="Nhập trả lời 2: (Vd: Freak)"
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
                  placeholder="Nhập trả lời 3: (Vd: Fear)"
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
                  placeholder="Nhập trả lời 4: (Vd: Horror)"
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
                  placeholder="Nhập trả lời đúng: (Vd: Fret)"
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
            onClick={handleEditEx}
          >
            + Sửa câu hỏi
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit Ex Modal End*/}

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
              Bạn có muốn xóa không?
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
                onClick={
                  deleteTestTableId !== 0
                    ? handleDeleteTestTable
                    : deleteTestId !== 0
                    ? handleDeleteTest
                    : handleDeleteEx
                }
                src="/img/logo/ok.png"
                alt=""
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* CONFIRM MODAL END*/}

      <ToastContainer autoClose={1500} style={{ textAlign: "center" }} />
    </Container>
  );
}

export default TestManagement;
