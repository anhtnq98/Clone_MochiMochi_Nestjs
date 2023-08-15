import { useEffect, useState } from "react";
import "../css/Note.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../unity/store";
import { ToastContainer, toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";

interface Notes {
  noteId: number;
  userId: string;
  content: string;
  complete: number;
}

function Note() {
  const currentUser: any = useSelector((state: RootState) => {
    return state.user.value;
  });
  let clickAudio = new Audio("/audio/Click.mp3");

  const [showConfirm, setShowConfirm] = useState(false);
  const handleCloseConfirm = () => {
    setShowConfirm(false), clickAudio.play();
  };

  const [noteId, setNoteId] = useState<number>(0);
  const [updateNote, setUpdateNote] = useState<any>(false);

  const [newNote, setNewNote] = useState<Notes>({
    noteId: 0,
    userId: "",
    content: "",
    complete: 0,
  });

  const [content, setContent] = useState<string>("");

  const [listNotes, setListNotes] = useState<Notes[]>([]);

  const loadListNotes = async () => {
    let result = await axios.get(`http://localhost:5550/api/v1/notes`);

    setListNotes(result.data);

    if (result.data.length > 0) {
      setNewNote({
        ...newNote,
        noteId: result.data[result.data?.length - 1].noteId + 1,
        userId: currentUser.userId,
        content: "",
        complete: 0,
      });
    } else {
      setNewNote({
        ...newNote,
        noteId: 1,
        userId: currentUser.userId,
        content: "",
        complete: 0,
      });
    }
  };

  let listNotesByUserId = listNotes.filter(
    (e: any) => e.userId === currentUser?.userId
  );

  console.log("note ===>", listNotes);
  console.log("listNotesByUserId ===>", listNotesByUserId);

  let completeNotes = listNotesByUserId.filter((e: any) => e.complete === 1);

  useEffect(() => {
    loadListNotes();
  }, [currentUser]);

  // Add New Note
  const handleAddNote = async () => {
    clickAudio.play();
    if (!newNote.content) {
      toast.error("Bạn chưa nhập ghi chú!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    await axios
      .post(`http://localhost:5550/api/v1/notes`, newNote)
      .then(() => {
        toast.success("Thêm ghi chú thành công!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        loadListNotes();
      })
      .catch((error) => console.log(`Không thể thêm ghi chú bởi lỗi ${error}`));
  };

  // Delete Note
  const handleDeleteNote = async () => {
    await axios
      .delete(`http://localhost:5550/api/v1/notes/${+noteId}`)
      .then(() => {
        toast.success("Xóa ghi chú thành công!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((error) => console.log(`Không thể xóa ghi chú bởi lỗi ${error}`));

    loadListNotes();
    setShowConfirm(false);
  };

  // Complete Note
  const handleCompleteNote = async (note: any) => {
    console.log("nc ===>", note?.complete, note);
    if (note?.complete === 1) {
      await axios.patch(`http://localhost:5550/api/v1/notes/${note?.noteId}`, {
        complete: 2,
      });
    } else {
      await axios.patch(`http://localhost:5550/api/v1/notes/${note?.noteId}`, {
        complete: 1,
      });
    }
    loadListNotes();
  };

  const handleEditNote = async (note: any) => {
    await axios.patch(`http://localhost:5550/api/v1/notes/${note?.noteId}`, {
      content: content,
    });
    toast.success("Cập nhật ghi chú thành công!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    setUpdateNote(false);
    loadListNotes();
  };

  return (
    <div className="memo-container">
      <div className="memo-header  animate__animated animate__backInDown animate__slow ">
        SỔ TAY CỦA MOCHI
      </div>
      <div className="memo-input-container animate__animated animate__fadeInDown  animate__delay-2s">
        <textarea
          id="note-input"
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          value={newNote.content}
          cols={55}
          rows={3}
          maxLength={80}
          placeholder="Viết ghi chú của bạn tại đây nhé (Lưu ý: Mỗi lần ghi chú chỉ tối đa 80 chữ)"
        />
      </div>
      <div
        onClick={handleAddNote}
        className="test-submit-container  animate__animated animate__fadeInDown  animate__delay-2s"
      >
        <div className="test-submit">Thêm ghi chú</div>
      </div>
      <div className="notes-guide">
        Để xác nhận hoàn thành, hãy nhấn đúp chuột vào giấy ghi chú ⸜(｡˃ ᵕ ˂ )⸝
      </div>
      <div
        className="animate__animated animate__fadeIn  animate__delay-2s"
        style={{
          fontSize: "18.5px",
          margin: "20px 0 15px 0",
          fontWeight: "700",
        }}
      >
        Tổng số ghi chú đã hoàn thành: {completeNotes?.length}/
        {listNotesByUserId?.length}
      </div>
      {listNotesByUserId?.length === 0 ? (
        <>
          <div className="notes-container animate__animated animate__fadeInUp  animate__delay-2s">
            <div className="note ">
              <div style={{ margin: "10px 0" }}></div>
              <div className="note-content">Bạn chưa có ghi chú</div>
            </div>
          </div>
        </>
      ) : (
        <div className="notes-container animate__animated animate__fadeIn  animate__delay-2s">
          {listNotesByUserId?.map((note: any, index: number) => (
            <div onDoubleClick={() => handleCompleteNote(note)} key={index}>
              <div
                className={
                  note?.complete === 1
                    ? "complete-check  animate__animated animate__fast animate__bounceInDown"
                    : "complete-check-none"
                }
              >
                <img src="/img/logo/check.png" alt="" />
              </div>
              <div className="note">
                <div className="edit-delete">
                  <div
                    onClick={() => {
                      setContent(note?.content);
                      setNoteId(note?.noteId);
                      setUpdateNote(true);
                    }}
                  >
                    Sửa
                  </div>
                  <div
                    onClick={() => {
                      setNoteId(note?.noteId), setShowConfirm(true);
                    }}
                  >
                    Xóa
                  </div>
                </div>
                {updateNote === true && noteId === note?.noteId ? (
                  <div className="edit-note-input">
                    <input
                      type="text"
                      value={content}
                      onChange={(e: any) => setContent(e.target.value)}
                    />
                    <Button
                      onClick={() => handleEditNote(note)}
                      variant="warning"
                    >
                      Sửa
                    </Button>{" "}
                    <Button
                      onClick={() => setUpdateNote(false)}
                      variant="danger"
                    >
                      Hủy
                    </Button>{" "}
                  </div>
                ) : (
                  <div className="note-content">{note?.content}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer autoClose={850} />
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
              Bạn có muốn xóa ghi chú này không?
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
                onClick={handleDeleteNote}
                src="/img/logo/ok.png"
                alt=""
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* CONFIRM MODAL END*/}
    </div>
  );
}

export default Note;
