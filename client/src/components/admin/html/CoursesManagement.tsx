import { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Modal,
  Form,
} from "react-bootstrap";

import "../css/AdminPage.css";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { storage } from "../../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import Loading from "../../layouts/html/Loading";
import debounce from "lodash.debounce";

interface Course {
  courseId: number;
  courseName: string;
  courseLangue: number;
  target: string;
  about: string;
}

type Lesson = any;

type NewWord = any;

const CoursesManagement = () => {
  // Danh sách các khóa học
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseById, setCourseById] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  // lấy bài học tương ứng mỗi khóa
  const [listLesson, setListLesson] = useState<Lesson>([]);
  const [listLessonsById, setListLessonsById] = useState<Lesson>([]);
  const [lessonById, setLessonById] = useState<Lesson>([]);
  const [editLessonIndex, setEditLessonIndex] = useState<number>(0);
  const [editNewWordIndex, setEditNewWordIndex] = useState<number>(0);

  // search
  const [searchCourseValue, setSearchCourseValue] = useState<string>("");
  const searchCV = searchCourseValue.trim();

  // lấy từ mới tương ứng mỗi bài
  const [listNewWord, setListNewWord] = useState<any>([]);
  const [listNewWordById, setListNewWordById] = useState<any>([]);

  // Đóng mở Modal
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [showLesson, setShowLesson] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [showEditLesson, setShowEditLesson] = useState(false);
  const [showNewWord, setShowNewWord] = useState(false);
  const [showAddNewWord, setShowAddNewWord] = useState(false);
  const [showEditNewWord, setShowEditNewWord] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  const [deleteCourseId, setDeleteCourseId] = useState<number>(0);
  const [deleteCourseIndex, setDeleteCourseIndex] = useState<number>(0);
  const [deleteLessonId, setDeleteLessonId] = useState<number>(0);
  const [deleteLessonIndex, setDeleteLessonIndex] = useState<number>(0);
  const [deleteNewWordId, setDeleteNewWordId] = useState<number>(0);
  const [deleteNewWordIndex, setDeleteNewWordIndex] = useState<number>(0);

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

  // Tạo giá trị khóa học mới
  const [newCourse, setNewCourse] = useState<Course>({
    courseId: 0,
    courseName: "",
    courseLangue: 0,
    target: "",
    about: "",
  });

  // Tạo giá trị edit khóa học
  const [editCourse, setEditCourse] = useState<Course>({
    courseId: 0,
    courseName: "",
    courseLangue: 0,
    target: "",
    about: "",
  });

  // Tạo giá trị bài học mới
  const [newLesson, setNewLesson] = useState<Lesson>({
    lessonId: 0,
    courseId: 0,
    lessonName: "",
    lessonSubName: "",
    lessonImg: "",
  });

  // Tạo giá trị edit bài học
  const [editLesson, setEditLesson] = useState<Lesson>({
    lessonId: 0,
    courseId: 0,
    lessonName: "",
    lessonSubName: "",
    lessonImg: "",
  });

  // Tạo giá trị từ mới mới
  const [newNewWord, setNewNewWord] = useState<NewWord>({
    newWordId: 0,
    lessonId: 0,
    title: "",
    contentOne: "",
    contentTwo: "",
    pronound: "",
    translate: "",
    newWordImg: "",
    voice: "",
  });

  // Tạo giá trị edit từ mới
  const [editNewWord, setEditNewWord] = useState<NewWord>({
    newWordId: 0,
    lessonId: 0,
    title: "",
    contentOne: "",
    contentTwo: "",
    pronound: "",
    translate: "",
    newWordImg: "",
    voice: "",
  });

  // Load tất cả khóa học
  const loadListCourse = async () => {
    setLoading(true);
    setTimeout(() => {
      axios
        .get(`http://localhost:5550/api/v1/courses/search?searchCV=${searchCV}`)
        .then((res) => {
          setCourses(res.data);
          setNewCourse({
            ...newCourse,
            courseId: res.data[res.data?.length - 1].courseId + 1,
            courseName: "",
            courseLangue: 0,
            target: "",
            about: "",
          });
        })
        .catch((err) => console.log(err));
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const delayedSearch = debounce(loadListCourse, 1000); // Đặt thời gian debounce là 500ms
    delayedSearch();
    return delayedSearch.cancel; // Hủy debounce khi component bị hủy
  }, [searchCV]);

  // Load tất cả bài học
  const loadLessons = async () => {
    let result = await axios.get(`http://localhost:5550/api/v1/lessons`);
    setListLesson(result.data);
  };

  useEffect(() => {
    loadLessons();
  }, []);

  // Load tất cả từ mời
  const loadNewWords = async () => {
    let result = await axios.get(`http://localhost:5550/api/v1/new_words`);
    setListNewWord(result.data);
  };

  useEffect(() => {
    loadNewWords();
  }, []);

  // Modal hiển thị danh sách bài học
  const handleLoadLesson = (courseId: number) => {
    let lessonsByCourseId = listLesson.filter(
      (e: any) => e.courseId === courseId
    );
    let courseById = courses.filter((e: any) => e.courseId === courseId);
    setListLessonsById(lessonsByCourseId);
    setCourseById(courseById);
    setNewLesson({
      ...newLesson,
      courseId: courseId,
      lessonId: listLesson[listLesson.length - 1].lessonId + 1,
    });
  };

  // Modal hiển thị danh sách từ mới
  const handleLoadNewWord = (lessonId: number) => {
    let newWordsByLessonId = listNewWord.filter(
      (e: any) => e.lessonId === lessonId
    );
    let lessonById = listLesson.filter((e: any) => e.lessonId === lessonId);
    setListNewWordById(newWordsByLessonId);
    setLessonById(lessonById);
    setNewNewWord({
      ...newNewWord,
      lessonId: lessonId,
      newWordId: listNewWord[listNewWord.length - 1].newWordId + 1,
    });
  };

  const handlePlayVoice = (voice: string) => {
    let playVoice = new Audio(voice);
    playVoice.play();
  };

  const handleVoiceUpload = (voice: string) => {
    let voiceUpload = new Audio(voice);
    voiceUpload.play();
  };

  // Hàm thêm khóa học
  const handleAddCourse = async () => {
    if (
      !newCourse.courseName ||
      !newCourse.courseLangue ||
      !newCourse.target ||
      !newCourse.about
    ) {
      toast.error("Nhập thiếu thông tin mất rồi!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    await axios
      .post(`http://localhost:5550/api/v1/courses`, newCourse)
      .then((res) => {
        setCourses([...courses, newCourse]);

        setShowAddPostModal(false);
        toast.success(`${res.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });

        loadListCourse();
      })
      .catch((err) => {
        toast.warning(`${err.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  // Hàm edit khóa học
  const handleEditCourses = async () => {
    const updatedCourses = courses.filter((course) =>
      course.courseId === editCourse.courseId ? editCourse : course
    );
    setCourses(updatedCourses);
    await axios
      .patch(
        `http://localhost:5550/api/v1/courses/${editCourse.courseId}`,
        editCourse
      )
      .then(() => {
        toast.success(`Thay đổi nội dung thành công! 🍀`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setShowEditPostModal(false);
        loadListCourse();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Hàm xóa khóa học
  const handleDeleteCourses = async () => {
    await axios.delete(
      `http://localhost:5550/api/v1/courses/${deleteCourseId}`
    );
    toast.success("Xóa khóa học thành công! 🍀", {
      position: toast.POSITION.TOP_RIGHT,
    });
    courses.splice(deleteCourseIndex, 1);
    setShowConfirm(false);
    loadListCourse();
  };

  // Dùng useRef để trả giá trị input file thành rỗng
  const fileInputRef: any = useRef(null);

  // Lưu giá trị ảnh để cho xem trước và đẩy lên firebase
  const [lessonImgPreview, setLessonImgPreview] = useState<any>(null);
  const [lessonImgUpload, setLessonImgUpload] = useState<any>(null);
  const [newWordImgPreview, setNewWordImgPreview] = useState<any>(null);
  const [newWordImgUpload, setNewWordImgUpload] = useState<any>(null);
  const [newWordVoicePreview, setNewWordVoicePreview] = useState<any>(null);
  const [newWordVoiceUpload, setNewWordVoiceUpload] = useState<any>(null);

  // State để theo dõi trạng thái loading
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Hàm xử lý khi thay đổi ảnh bài học
  const handleLessonImageChange = async (e: any) => {
    const file = e.target.files[0];
    if (file && newLesson.lessonName && newLesson.lessonSubName) {
      setLessonImgUpload(e.target.files[0]);
      const reader: any = new FileReader();
      reader.addEventListener("load", () => {
        setLessonImgPreview(reader.result);
      });
      reader.readAsDataURL(file);
    } else {
      toast.warning("Nhập tên bài học trước nha", {
        position: toast.POSITION.TOP_RIGHT,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  // Hàm xử lý khi edit ảnh bài học
  const handleLessonEditImageChange = async (e: any) => {
    const file = e.target.files[0];
    if (file && editLesson.lessonName && editLesson.lessonSubName) {
      setLessonImgUpload(e.target.files[0]);
      const reader: any = new FileReader();
      reader.addEventListener("load", () => {
        setLessonImgPreview(reader.result);
      });
      reader.readAsDataURL(file);
    } else {
      toast.warning("Nhập tên bài học trước nha", {
        position: toast.POSITION.TOP_RIGHT,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  // Hàm xử lý khi thay đổi ảnh từ mới
  const handleNewWordImageChange = async (e: any) => {
    const file = e.target.files[0];
    if (file && newNewWord.title && newNewWord.contentOne) {
      setNewWordImgUpload(e.target.files[0]);
      const reader: any = new FileReader();
      reader.addEventListener("load", () => {
        setNewWordImgPreview(reader.result);
      });
      reader.readAsDataURL(file);
    } else {
      toast.warning("Nhập từ mới trước nha", {
        position: toast.POSITION.TOP_RIGHT,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  // Hàm xử lý khi edit ảnh bài học
  const handleNewWordEditImageChange = async (e: any) => {
    const file = e.target.files[0];
    if (file && editNewWord.title && editNewWord.contentOne) {
      setNewWordImgUpload(e.target.files[0]);
      const reader: any = new FileReader();
      reader.addEventListener("load", () => {
        setNewWordImgPreview(reader.result);
      });
      reader.readAsDataURL(file);
    } else {
      toast.warning("Nhập tên từ mới trước nha", {
        position: toast.POSITION.TOP_RIGHT,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  // Hàm xử lý khi thay đổi âm thanh từ mới
  const handleNewWordVoiceChange = async (e: any) => {
    const file = e.target.files[0];
    if (file && newNewWord.title && newNewWord.contentOne) {
      setNewWordVoiceUpload(e.target.files[0]);
      const reader: any = new FileReader();
      reader.addEventListener("load", () => {
        setNewWordVoicePreview(reader.result);
      });
      reader.readAsDataURL(file);
    } else {
      toast.warning("Nhập từ mới trước nha", {
        position: toast.POSITION.TOP_RIGHT,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  // Hàm xử lý khi thay đổi âm thanh từ mới
  const handleNewWordEditVoiceChange = async (e: any) => {
    const file = e.target.files[0];
    if (file && editNewWord.title && editNewWord.contentOne) {
      setNewWordVoiceUpload(e.target.files[0]);
      const reader: any = new FileReader();
      reader.addEventListener("load", () => {
        setNewWordVoicePreview(reader.result);
      });
      reader.readAsDataURL(file);
    } else {
      toast.warning("Nhập từ mới trước nha", {
        position: toast.POSITION.TOP_RIGHT,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  // Hàm lưu giá trị ảnh cho bài học
  const handleAddLesson = async () => {
    if (!lessonImgUpload) {
      toast.warning("Nhớ nhập đầy đủ thông tin nhé ^^", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    try {
      setIsUploading(true);
      setUploadProgress(0);
      handleLoadLesson(courseById[0].courseId);
      // Tải lên ảnh lên Firebase Storage
      const storageRef = ref(
        storage,
        `admin/courses/${courseById[0]?.courseName}/${newLesson.lessonName}/${dateTime}_${lessonImgUpload.name}`
      );

      const uploadTask = uploadBytesResumable(storageRef, lessonImgUpload);

      uploadTask.on("state_changed", (snapshot: any) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      });

      await uploadTask;

      // Lấy URL của ảnh đã tải lên
      const lessonImgUrl = await getDownloadURL(storageRef);

      // Cập nhật trường lessonImg trong state newLesson
      setNewLesson((prevLesson: any) => ({
        ...prevLesson,
        lessonImg: lessonImgUrl,
      }));
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
    if (newLesson.lessonImg) {
      axios
        .post("http://localhost:5550/api/v1/lessons", newLesson)
        .then((res) => {
          toast.success(`${res.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
          setLessonImgPreview(null);
          setLessonImgUpload(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = null;
          }

          setNewLesson({
            ...newLesson,
            lessonName: "",
            lessonSubName: "",
            lessonImg: "",
          });
          // load lại data
          setShowAddLesson(false);
          loadLessons();
          listLessonsById.push(newLesson);
        })
        .catch((error) => {
          toast.warning(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        });
    }
  }, [newLesson]);

  // Hàm edit bài học
  const handleEditLesson = async () => {
    if (!editLesson.lessonImg) {
      toast.warning("Nhớ nhập đầy đủ thông tin nhé ⚠️", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (!lessonImgUpload) {
      await axios
        .patch(
          `http://localhost:5550/api/v1/lessons/${editLesson.lessonId}`,
          editLesson
        )
        .then(() => {
          // load lại data
          listLessonsById.splice(editLessonIndex, 1, editLesson);
        })
        .catch((err) => console.log(err));
    } else {
      try {
        setIsUploading(true);
        setUploadProgress(0);
        handleLoadLesson(courseById[0].courseId);
        // Tải lên ảnh lên Firebase Storage
        const storageRef = ref(
          storage,
          `admin/courses/${courseById[0]?.courseName}/${editLesson.lessonName}/${dateTime}_${lessonImgUpload.name}`
        );

        const uploadTask = uploadBytesResumable(storageRef, lessonImgUpload);

        uploadTask.on("state_changed", (snapshot: any) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        });

        await uploadTask;

        // Lấy URL của ảnh đã tải lên
        const lessonImgUrl = await getDownloadURL(storageRef);

        // Cập nhật trường lessonImg trong state
        setEditLesson((prevLesson: any) => ({
          ...prevLesson,
          lessonImg: lessonImgUrl,
        }));
        setIsUploading(false);
        setUploadProgress(0);
      } catch (error) {
        console.error("Error uploading image:", error);
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
    setShowEditLesson(false);
    toast.success("Sửa bài học thành công! 🍀", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // Sau khi lưu giá trị ảnh xong thì chuyển hướng lưu vào trong database
  useEffect(() => {
    if (editLesson.lessonImg) {
      axios
        .patch(
          `http://localhost:5550/api/v1/lessons/${editLesson.lessonId}`,
          editLesson
        )
        .then(() => {
          setLessonImgPreview(null);
          setLessonImgUpload(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = null;
          }

          // load lại data
          listLessonsById.splice(editLessonIndex, 1, editLesson);
          loadLessons();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [editLesson.lessonImg]);

  // Hàm xóa bài học
  const handleDeleteLessons = async () => {
    await axios.delete(
      `http://localhost:5550/api/v1/lessons/${deleteLessonId}`
    );
    toast.success("Xóa bài học thành công! 🍀", {
      position: toast.POSITION.TOP_RIGHT,
    });
    listLessonsById.splice(deleteLessonIndex, 1);
    setShowConfirm(false);
    loadLessons();
  };

  // Hàm lưu giá trị ảnh cho từ mới
  const handleAddNewWord = async () => {
    if (!newWordImgUpload) {
      toast.warning("Nhớ nhập đầy đủ thông tin nhé ^^", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    try {
      setIsUploading(true);
      setUploadProgress(0);
      // Tải lên ảnh lên Firebase Storage
      const storageRef = ref(
        storage,
        `admin/courses/${courseById[0]?.courseName}/${lessonById[0]?.lessonName}/${newNewWord.title}/${dateTime}_${newWordImgUpload.name}`
      );

      // Tải lên âm thanh lên Firebase Storage
      const storageRef2 = ref(
        storage,
        `admin/courses/${courseById[0]?.courseName}/${lessonById[0]?.lessonName}/${newNewWord.title}/${dateTime}_${newWordVoiceUpload.name}`
      );

      const uploadTask = uploadBytesResumable(storageRef, newWordImgUpload);
      const uploadTask2 = uploadBytesResumable(storageRef2, newWordVoiceUpload);

      uploadTask.on("state_changed", (snapshot: any) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      });

      uploadTask2.on("state_changed", (snapshot: any) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      });

      await uploadTask;

      await uploadTask2;

      // Lấy URL của ảnh đã tải lên
      const newWordImgUrl = await getDownloadURL(storageRef);
      const newWordVoiceUrl = await getDownloadURL(storageRef2);

      // Cập nhật trường newWordImg trong state newNewWord
      setNewNewWord((prevNewWord: any) => ({
        ...prevNewWord,
        newWordImg: newWordImgUrl,
        voice: newWordVoiceUrl,
      }));
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

  // Sau khi lưu giá trị ảnh và âm thanh xong thì chuyển hướng lưu vào trong database từ mới
  useEffect(() => {
    if (newNewWord.newWordImg && newNewWord.voice) {
      axios
        .post("http://localhost:5550/api/v1/new_words", newNewWord)
        .then((res) => {
          loadNewWords();
          toast.success(`${res.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });

          setNewWordImgPreview(null);
          setNewWordImgUpload(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = null;
          }
          setNewNewWord({
            ...newNewWord,
            newWordId: newNewWord.newWordId + 1,
            title: "",
            contentOne: "",
            contentTwo: "",
            pronound: "",
            translate: "",
            newWordImg: "",
            voice: "",
          });
          // load lại data
          setShowAddNewWord(false);
          listNewWordById.push(newNewWord);
        })
        .catch((error) => {
          toast.warning(`${error.response.data.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        });
    }
  }, [newNewWord]);

  // Hàm lưu giá trị ảnh cho từ mới
  const handleEditNewWord = async () => {
    if (!editNewWord.newWordImg && !editNewWord.voice) {
      toast.warning("Nhớ nhập đầy đủ thông tin nhé ^^", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    if (!newWordImgUpload || !newWordVoiceUpload) {
      await axios
        .patch(
          `http://localhost:5550/api/v1/new_words/${editNewWord.newWordId}`,
          editNewWord
        )
        .then(() => {
          // load lại data
          listNewWordById.splice(editNewWordIndex, 1, editNewWord);
        })
        .catch((err) => console.log(err));
    } else {
      try {
        setIsUploading(true);
        setUploadProgress(0);
        handleLoadNewWord(lessonById[0].lessonId);
        // Tải lên ảnh lên Firebase Storage
        const storageRef = ref(
          storage,
          `admin/courses/${courseById[0]?.courseName}/${lessonById[0]?.lessonName}/${newNewWord.title}/${dateTime}_${newWordImgUpload.name}`
        );

        // Tải lên âm thanh lên Firebase Storage
        const storageRef2 = ref(
          storage,
          `admin/courses/${courseById[0]?.courseName}/${lessonById[0]?.lessonName}/${newNewWord.title}/${dateTime}_${newWordVoiceUpload.name}`
        );

        const uploadTask = uploadBytesResumable(storageRef, newWordImgUpload);
        const uploadTask2 = uploadBytesResumable(
          storageRef2,
          newWordVoiceUpload
        );

        uploadTask.on("state_changed", (snapshot: any) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        });

        uploadTask2.on("state_changed", (snapshot: any) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        });

        await uploadTask;

        await uploadTask2;

        // Lấy URL của ảnh đã tải lên
        const newWordImgUrl = await getDownloadURL(storageRef);
        const newWordVoiceUrl = await getDownloadURL(storageRef2);

        // Cập nhật trường newWordImg trong state newNewWord
        setEditNewWord((prevNewWord: any) => ({
          ...prevNewWord,
          newWordImg: newWordImgUrl,
          voice: newWordVoiceUrl,
        }));

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
    }
    setShowEditNewWord(false);
    toast.success("Sửa từ mới thành công! 🍀", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // Sau khi lưu giá trị ảnh và âm thanh xong thì chuyển hướng lưu vào trong database từ mới
  useEffect(() => {
    if (editNewWord.newWordImg && editNewWord.voice) {
      axios
        .patch(
          `http://localhost:5550/api/v1/new_words/${editNewWord.newWordId}`,
          editNewWord
        )
        .then(() => {
          setNewWordImgPreview(null);
          setNewWordImgUpload(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = null;
          }

          // load lại data
          listNewWordById.splice(editNewWordIndex, 1, editNewWord);
          loadNewWords();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [editNewWord.newWordImg, editNewWord.voice]);

  // Hàm xóa từ mới
  const handleDeleteNewWords = async () => {
    await axios.delete(
      `http://localhost:5550/api/v1/new_words/${deleteNewWordId}`
    );
    toast.success("Xóa từ mới thành công! 🍀", {
      position: toast.POSITION.TOP_RIGHT,
    });
    listNewWordById.splice(deleteNewWordIndex, 1);
    setShowConfirm(false);
    loadNewWords();
  };

  // Hàm render ra danh sách khóa học
  const renderCourseTable = () => {
    // Phân trang
    const itemsPerPage = 6;
    const totalPages = Math.ceil(courses.length / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedCourses = courses
      .sort((a, b) => b.courseId - a.courseId)
      .slice(startIndex, endIndex);

    return (
      <>
        {loading ? <Loading /> : <></>}
        <Table
          className="table-container animate__animated animate__fadeInDown"
          striped
          bordered
        >
          <thead>
            <tr>
              <th>STT</th>
              <th>TÊN KHÓA HỌC</th>
              <th>NGÔN NGỮ</th>
              <th>MỤC TIÊU</th>
              <th>NỘI DUNG</th>
              <th>BÀI HỌC</th>
              <th colSpan={2}>SỬA / XÓA</th>
            </tr>
          </thead>
          <tbody>
            {displayedCourses.map((course, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{course.courseName}</td>
                <td>
                  {course.courseLangue === 1 ? "Tiếng Anh" : "Tiếng Nhật"}
                </td>
                <td>{course.target}</td>
                <td>{course.about}</td>
                <td
                  onClick={() => {
                    setShowLesson(true);
                    handleLoadLesson(course.courseId);
                  }}
                >
                  <div className="show-detail">Xem chi tiết</div>
                </td>
                <td>
                  <div
                    className="ql-icon"
                    onClick={() => {
                      setEditCourse(course);
                      setShowEditPostModal(true);
                    }}
                  >
                    <img src="/img/logo/edit.png" alt="" />
                  </div>
                </td>
                <td>
                  <div
                    className="ql-icon"
                    onClick={() => {
                      setDeleteCourseId(course?.courseId);
                      setDeleteCourseIndex(index);
                      setShowConfirm(true);
                    }}
                  >
                    <img src="/img/logo/delete.png" alt="" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
      </>
    );
  };

  return (
    <Container className="admin-page-big-container">
      {/* PHẦN MAIN */}
      <Row>
        <div className="admin-page-container">
          <AdminNavbar />
          <Col md={8}>
            <div className="management">
              <div className="management-title">QUẢN LÝ KHÓA HỌC</div>
              <div className="management-add-search">
                <div
                  style={{
                    margin: "0px",
                    fontWeight: "bolder",
                  }}
                  className="home-wrap-button-contain"
                  onClick={() => setShowAddPostModal(true)}
                >
                  <div style={{ padding: "5px" }} className="home-wrap-button">
                    + Thêm khóa học
                  </div>
                </div>
                {/* SEARCH */}
                <div className="management-search">
                  <input
                    onChange={(e: any) => setSearchCourseValue(e.target.value)}
                    value={searchCourseValue}
                    type="text"
                    placeholder="Tìm kiếm khóa học..."
                  />
                  <img src="/img/logo/search.svg" alt="" />
                </div>
                {/* SEARCH END*/}
              </div>
              {/* Danh sách khóa học được lưu ở đây */}
              {renderCourseTable()}
            </div>
          </Col>
        </div>
      </Row>
      {/* HẾT PHẦN MAIN */}

      {/* Add Course Modal */}
      <Modal
        className="add-post-modal"
        size="lg"
        backdrop="static"
        show={showAddPostModal}
        onHide={() => setShowAddPostModal(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowAddPostModal(false)}
                src="/img/logo/close.svg"
                alt=""
              />
            </div>
            <div
              className="list-course-modal-title-text"
              style={{ fontSize: "25px" }}
            >
              THÊM KHÓA HỌC
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form className="add-course-container">
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Tên khóa học</label>
                <Form.Control
                  type="text"
                  value={newCourse.courseName}
                  placeholder="Nhập tên khóa học: (Vd: IELTS CƠ BẢN)"
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, courseName: e.target.value })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formGridState">
                <label>Ngôn ngữ</label>
                <Form.Select
                  defaultValue="Chọn ngôn ngữ..."
                  value={newCourse.courseLangue}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      courseLangue: +e.target.value,
                    })
                  }
                >
                  <option value={0}>Chọn ngôn ngữ...</option>
                  <option value={1}>Tiếng Anh</option>
                  <option value={2}>Tiếng Nhật</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div>
              <Form.Group>
                <label>Mục tiêu</label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newCourse.target}
                  placeholder="Nhập mục tiêu: (Vd: Ôn IELTS 6.5 Reading & Listening)"
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, target: e.target.value })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group>
                <label>Nội dung</label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newCourse.about}
                  placeholder="Nhập nội dung: (Vd: Hơn 1200 từ IELTS)"
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, about: e.target.value })
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
            onClick={handleAddCourse}
          >
            + Thêm khóa học
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Add Course Modal End*/}

      {/* Edit Course Modal */}
      <Modal
        className="add-post-modal"
        size="lg"
        backdrop="static"
        show={showEditPostModal}
        onHide={() => setShowEditPostModal(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowEditPostModal(false)}
                src="/img/logo/close.svg"
                alt=""
              />
            </div>
            <div
              className="list-course-modal-title-text"
              style={{ fontSize: "25px" }}
            >
              CHỈNH SỬA KHÓA HỌC
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form className="add-course-container">
            <div>
              <Form.Group controlId="formEditPostTitle">
                <Form.Label>Tên Khóa Học</Form.Label>
                <Form.Control
                  type="text"
                  value={editCourse.courseName}
                  onChange={(e) =>
                    setEditCourse({ ...editCourse, courseName: e.target.value })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formGridState">
                <label>Ngôn ngữ</label>
                <Form.Select
                  defaultValue="Chọn ngôn ngữ..."
                  value={editCourse.courseLangue}
                  onChange={(e) =>
                    setEditCourse({
                      ...editCourse,
                      courseLangue: +e.target.value,
                    })
                  }
                >
                  <option value={0}>Chọn ngôn ngữ...</option>
                  <option value={1}>Tiếng Anh</option>
                  <option value={2}>Tiếng Nhật</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div>
              <Form.Group>
                <Form.Label>Mục Tiêu</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editCourse.target}
                  onChange={(e) =>
                    setEditCourse({ ...editCourse, target: e.target.value })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group>
                <Form.Label>Nội Dung</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editCourse.about}
                  onChange={(e) =>
                    setEditCourse({ ...editCourse, about: e.target.value })
                  }
                />
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontWeight: "bold" }}
            variant="warning"
            onClick={handleEditCourses}
          >
            Sửa khóa học
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit Course Modal End */}

      {/* Show Lesson Modal */}
      <Modal
        className="add-post-modal"
        size="lg"
        backdrop="static"
        show={showLesson}
        onHide={() => setShowLesson(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowLesson(false)}
                src="/img/logo/close.svg"
                alt=""
              />
            </div>
            <div
              className="list-course-modal-title-text"
              style={{ fontSize: "25px" }}
            >
              DANH SÁCH BÀI HỌC
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
            onClick={() => setShowAddLesson(true)}
          >
            <div style={{ padding: "5px" }} className="home-wrap-button">
              + Thêm bài học
            </div>
          </div>
          <Table className="table-container" striped bordered>
            <thead>
              <tr>
                <th>STT</th>
                <th>ẢNH</th>
                <th>TÊN BÀI HỌC</th>
                <th>TÊN TIẾNG VIỆT</th>
                <th>TỪ MỚI</th>
                <th colSpan={2}>SỬA / XÓA</th>
              </tr>
            </thead>
            <tbody>
              {listLessonsById
                .sort((a: any, b: any) => b.lessonId - a.lessonId)
                ?.map((lesson: any, index: number) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        style={{
                          borderRadius: "100%",
                        }}
                        width={"45px"}
                        height={"45px"}
                        src={`${lesson?.lessonImg}`}
                        alt=""
                      />
                    </td>
                    <td>{lesson?.lessonName}</td>
                    <td>{lesson?.lessonSubName}</td>
                    <td
                      onClick={() => {
                        setShowNewWord(true);
                        handleLoadNewWord(lesson.lessonId);
                      }}
                    >
                      <div className="show-detail">Xem chi tiết</div>
                    </td>

                    <td
                      onClick={() => {
                        setEditLessonIndex(index);
                        setShowEditLesson(true);
                        setEditLesson(lesson);
                      }}
                    >
                      <div className="ql-icon">
                        <img src="/img/logo/edit.png" alt="" />
                      </div>
                    </td>
                    <td>
                      <div
                        className="ql-icon"
                        onClick={() => {
                          setDeleteLessonId(lesson?.lessonId);
                          setDeleteLessonIndex(index);
                          setShowConfirm(true);
                        }}
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
      {/* Show Lesson Modal End*/}

      {/* Add Lesson Modal */}
      <Modal
        className="add-post-modal"
        size="lg"
        backdrop="static"
        show={showAddLesson}
        onHide={() => setNewLesson(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowAddLesson(false)}
                src="/img/logo/close.svg"
                alt=""
              />
            </div>
            <div
              className="list-course-modal-title-text"
              style={{ fontSize: "25px" }}
            >
              THÊM BÀI HỌC
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form className="add-course-container">
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Tên bài học</label>
                <Form.Control
                  type="text"
                  value={newLesson.lessonName}
                  placeholder="Nhập tên bài học: (Vd: Schools)"
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, lessonName: e.target.value })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group>
                <label>Tên Tiếng Việt</label>
                <Form.Control
                  type="text"
                  value={newLesson.lessonSubName}
                  placeholder="Nhập tên Tiếng Việt: (Vd: Trường học)"
                  onChange={(e) =>
                    setNewLesson({
                      ...newLesson,
                      lessonSubName: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formFileMultiple" className="mb-3">
                <Form.Label>Up Ảnh</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleLessonImageChange}
                  disabled={isUploading} // Disable input during upload
                  className="input-file"
                  multiple
                  ref={fileInputRef}
                />
                {isUploading && (
                  <div>
                    <div>Loading...</div>
                    <div>{uploadProgress}%</div>
                  </div>
                )}
              </Form.Group>
              <div className="preview-img-container">
                <div className="preview-img">
                  {!lessonImgPreview ? (
                    <></>
                  ) : (
                    <>
                      <img src={lessonImgPreview} alt="" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontWeight: "bolder" }}
            variant="warning"
            onClick={handleAddLesson}
            disabled={isUploading} // Disable button during upload
          >
            {isUploading ? "Đang tải lên..." : "+ Thêm bài học"}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Add Lesson Modal End*/}

      {/* Edit Lesson Modal */}
      <Modal
        className="add-post-modal"
        size="lg"
        backdrop="static"
        show={showEditLesson}
        onHide={() => setEditLesson(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowEditLesson(false)}
                src="/img/logo/close.svg"
                alt=""
              />
            </div>
            <div
              className="list-course-modal-title-text"
              style={{ fontSize: "25px" }}
            >
              CHỈNH SỬA BÀI HỌC
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form className="add-course-container">
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Tên bài học</label>
                <Form.Control
                  type="text"
                  value={editLesson.lessonName}
                  onChange={(e) =>
                    setEditLesson({ ...editLesson, lessonName: e.target.value })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group>
                <label>Tên Tiếng Việt</label>
                <Form.Control
                  type="text"
                  value={editLesson.lessonSubName}
                  onChange={(e) =>
                    setEditLesson({
                      ...editLesson,
                      lessonSubName: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formFileMultiple" className="mb-3">
                <Form.Label>Up Ảnh</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleLessonEditImageChange}
                  disabled={isUploading} // Disable input during upload
                  className="input-file"
                  multiple
                  ref={fileInputRef}
                />
                {isUploading && (
                  <div>
                    <div>Loading...</div>
                    <div>{uploadProgress}%</div>
                  </div>
                )}
              </Form.Group>
              <div className="preview-img-container">
                <div className="preview-img">
                  {!lessonImgPreview ? (
                    <>
                      <img src={editLesson.lessonImg} alt="" />
                    </>
                  ) : (
                    <>
                      <img src={lessonImgPreview} alt="" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontWeight: "bolder" }}
            variant="warning"
            onClick={handleEditLesson}
            disabled={isUploading} // Disable button during upload
          >
            {isUploading ? "Đang tải lên..." : "Sửa bài học"}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit Post Modal End*/}

      {/* Show New Word Modal */}
      <Modal
        className="add-post-modal"
        size="xl"
        backdrop="static"
        show={showNewWord}
        onHide={() => setShowNewWord(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowNewWord(false)}
                src="/img/logo/close.svg"
                alt=""
              />
            </div>
            <div
              className="list-course-modal-title-text"
              style={{ fontSize: "25px" }}
            >
              DANH SÁCH TỪ MỚI
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <div
            style={{
              margin: "0px",
              fontWeight: "bolder",
            }}
            className="home-wrap-button-contain"
            onClick={() => setShowAddNewWord(true)}
          >
            <div style={{ padding: "5px" }} className="home-wrap-button">
              + Thêm từ mới
            </div>
          </div>
          <Table className="table-container" striped bordered>
            <thead>
              <tr>
                <th>STT</th>
                <th>ẢNH</th>
                <th>TỪ MỚI</th>
                <th>ĐOẠN MỘT</th>
                <th>ĐOẠN HAI</th>
                <th>PHÁT ÂM</th>
                <th>DỊCH</th>
                <th>GIỌNG ĐỌC</th>
                <th colSpan={2}>SỬA / XÓA</th>
              </tr>
            </thead>
            <tbody>
              {listNewWordById
                .sort((a: any, b: any) => b.newWordId - a.newWordId)
                ?.map((newWord: any, index: number) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        style={{
                          borderRadius: "100%",
                        }}
                        width={"45px"}
                        height={"45px"}
                        src={`${newWord?.newWordImg}`}
                        alt=""
                      />
                    </td>
                    <td>{newWord?.title}</td>
                    <td>{newWord?.contentOne}</td>
                    <td>{newWord?.contentTwo}</td>
                    <td>{newWord?.pronound}</td>
                    <td>{newWord?.translate}</td>
                    <td onClick={() => handlePlayVoice(newWord?.voice)}>
                      <img
                        className="new-word-sound"
                        style={{
                          borderRadius: "100%",
                        }}
                        width={"45px"}
                        src="/img/logo/sound.svg"
                        alt=""
                      />
                    </td>
                    <td
                      onClick={() => {
                        setEditNewWordIndex(index);
                        setShowEditNewWord(true);
                        setEditNewWord(newWord);
                      }}
                    >
                      <div className="ql-icon">
                        <img src="/img/logo/edit.png" alt="" />
                      </div>
                    </td>
                    <td>
                      <div
                        onClick={() => {
                          setDeleteNewWordId(newWord?.newWordId);
                          setDeleteNewWordIndex(index);
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
      {/* Show New Word Modal End*/}

      {/* Add New Word Modal */}
      <Modal
        className="add-post-modal"
        size="lg"
        backdrop="static"
        show={showAddNewWord}
        onHide={() => setShowAddNewWord(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowAddNewWord(false)}
                src="/img/logo/close.svg"
                alt=""
              />
            </div>
            <div
              className="list-course-modal-title-text"
              style={{ fontSize: "25px" }}
            >
              THÊM TỪ MỚI
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form className="add-course-container">
            <div>
              <Form.Group controlId="formAddPostTitle">
                <label>Từ Mới</label>
                <Form.Control
                  type="text"
                  value={newNewWord.title}
                  placeholder="Nhập từ mới: (Vd: student)"
                  onChange={(e) =>
                    setNewNewWord({ ...newNewWord, title: e.target.value })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group>
                <label>Đoạn Một</label>
                <Form.Control
                  type="text"
                  value={newNewWord.contentOne}
                  placeholder="Nhập đoạn một: (Vd: His younger sister is a)"
                  onChange={(e) =>
                    setNewNewWord({
                      ...newNewWord,
                      contentOne: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group>
                <label>Đoạn Hai</label>
                <Form.Control
                  type="text"
                  value={newNewWord.contentTwo}
                  placeholder="Nhập đoạn hai: (Vd: at that university.)"
                  onChange={(e) =>
                    setNewNewWord({
                      ...newNewWord,
                      contentTwo: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group>
                <label>Phát Âm</label>
                <Form.Control
                  type="text"
                  value={newNewWord.pronound}
                  placeholder="Nhập phát âm của từ: (Vd: /ˈstuːdnt/.)"
                  onChange={(e) =>
                    setNewNewWord({
                      ...newNewWord,
                      pronound: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group>
                <label>Nghĩa Tiếng Việt</label>
                <Form.Control
                  type="text"
                  value={newNewWord.translate}
                  placeholder="Nhập nghĩa Tiếng Việt: (Vd: Học sinh, sinh viên (n).)"
                  onChange={(e) =>
                    setNewNewWord({
                      ...newNewWord,
                      translate: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formFileMultiple" className="mb-3">
                <Form.Label>Up Ảnh Minh Hoạ</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleNewWordImageChange}
                  disabled={isUploading} // Disable input during upload
                  className="input-file"
                  multiple
                  ref={fileInputRef}
                />
                {isUploading && (
                  <div>
                    <div>Loading...</div>
                    <div>{uploadProgress}%</div>
                  </div>
                )}
              </Form.Group>
              <div className="preview-img-container">
                <div className="preview-img">
                  {!newWordImgPreview ? (
                    <></>
                  ) : (
                    <>
                      <img src={newWordImgPreview} alt="" />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div>
              <Form.Group controlId="formFileMultiple" className="mb-3">
                <Form.Label>Up Giọng Đọc</Form.Label>
                <Form.Control
                  type="file"
                  accept="audio/*"
                  onChange={handleNewWordVoiceChange}
                  disabled={isUploading} // Disable input during upload
                  className="input-file"
                  multiple
                  ref={fileInputRef}
                />
                {isUploading && (
                  <div>
                    <div>Loading...</div>
                    <div>{uploadProgress}%</div>
                  </div>
                )}
              </Form.Group>
              {!newWordVoicePreview ? (
                <></>
              ) : (
                <div
                  onClick={() => handleVoiceUpload(newWordVoicePreview)}
                  className="voice-upload"
                >
                  <img
                    className="new-word-sound"
                    style={{
                      borderRadius: "100%",
                    }}
                    width={"85px"}
                    src="/img/logo/sound.svg"
                    alt=""
                  />
                </div>
              )}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontWeight: "bolder" }}
            variant="warning"
            onClick={handleAddNewWord}
            disabled={isUploading} // Disable button during upload
          >
            {isUploading ? "Đang tải lên..." : "+ Thêm bài học"}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Add New Word Modal End*/}

      {/* Edit New Word Modal */}
      <Modal
        className="add-post-modal"
        size="lg"
        backdrop="static"
        show={showEditNewWord}
        onHide={() => setShowEditNewWord(false)}
      >
        <Modal.Header>
          <div className="list-course-modal-title">
            <div>
              <img
                onClick={() => setShowEditNewWord(false)}
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
                <label>Từ Mới</label>
                <Form.Control
                  type="text"
                  value={editNewWord.title}
                  onChange={(e) =>
                    setEditNewWord({ ...editNewWord, title: e.target.value })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group>
                <label>Đoạn Một</label>
                <Form.Control
                  type="text"
                  value={editNewWord.contentOne}
                  onChange={(e) =>
                    setEditNewWord({
                      ...editNewWord,
                      contentOne: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group>
                <label>Đoạn Hai</label>
                <Form.Control
                  type="text"
                  value={editNewWord.contentTwo}
                  onChange={(e) =>
                    setEditNewWord({
                      ...editNewWord,
                      contentTwo: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group>
                <label>Phát Âm</label>
                <Form.Control
                  type="text"
                  value={editNewWord.pronound}
                  onChange={(e) =>
                    setEditNewWord({
                      ...editNewWord,
                      pronound: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group>
                <label>Dịch</label>
                <Form.Control
                  type="text"
                  value={editNewWord.translate}
                  onChange={(e) =>
                    setEditNewWord({
                      ...editNewWord,
                      translate: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="formFileMultiple" className="mb-3">
                <Form.Label>Up Ảnh</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleNewWordEditImageChange}
                  disabled={isUploading} // Disable input during upload
                  className="input-file"
                  multiple
                  ref={fileInputRef}
                />
                {isUploading && (
                  <div>
                    <div>Loading...</div>
                    <div>{uploadProgress}%</div>
                  </div>
                )}
              </Form.Group>
              <div className="preview-img-container">
                <div className="preview-img">
                  {!newWordImgPreview ? (
                    <>
                      <img src={editNewWord.newWordImg} alt="" />
                    </>
                  ) : (
                    <>
                      <img src={newWordImgPreview} alt="" />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div>
              <Form.Group controlId="formFileMultiple" className="mb-3">
                <Form.Label>Up Giọng Đọc</Form.Label>
                <Form.Control
                  type="file"
                  accept="audio/*"
                  onChange={handleNewWordEditVoiceChange}
                  disabled={isUploading} // Disable input during upload
                  className="input-file"
                  multiple
                  ref={fileInputRef}
                />
                {isUploading && (
                  <div>
                    <div>Loading...</div>
                    <div>{uploadProgress}%</div>
                  </div>
                )}
              </Form.Group>
              {!newWordVoicePreview ? (
                <>
                  <div
                    onClick={() => handleVoiceUpload(editNewWord.voice)}
                    className="voice-upload"
                  >
                    <img
                      className="new-word-sound"
                      style={{
                        borderRadius: "100%",
                      }}
                      width={"85px"}
                      src="/img/logo/sound.svg"
                      alt=""
                    />
                  </div>
                </>
              ) : (
                <div
                  onClick={() => handleVoiceUpload(newWordVoicePreview)}
                  className="voice-upload"
                >
                  <img
                    className="new-word-sound"
                    style={{
                      borderRadius: "100%",
                    }}
                    width={"85px"}
                    src="/img/logo/sound.svg"
                    alt=""
                  />
                </div>
              )}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ fontWeight: "bolder" }}
            variant="warning"
            onClick={handleEditNewWord}
            disabled={isUploading} // Disable button during upload
          >
            {isUploading ? "Đang tải lên..." : "Sửa từ mới"}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit Post Modal End*/}

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
                  deleteCourseId !== 0
                    ? handleDeleteCourses
                    : deleteLessonId !== 0
                    ? handleDeleteLessons
                    : handleDeleteNewWords
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
};

export default CoursesManagement;
