import { Link } from "react-router-dom";
// import {useEffect}from "react"
import "../css/Home.css";
import { useDispatch } from "react-redux";
import { changeIsActive } from "../../../features/changeActive";
// import axios from "axios";

function Home() {
  const dispatch = useDispatch();
  let clickAudio = new Audio("/audio/Click.mp3");

  // let getAccessToken=localStorage.getItem("accessToken")
  // let token = getAccessToken?JSON.parse(getAccessToken) : null

  //   useEffect(()=>{
  //     console.log("hihi");

  //     if(token){
  //       axios.get("http://localhost:5500/api/v1/user",{headers:{Authorization:token}}).then((res)=> console.log(res.data)
  //       ).catch((err)=>console.log(err)
  //     )
  //     }
  //   },[])

  //   console.log("access", token);

  return (
    <div className="home-container">
      <div className="home-wrap animate__animated animate__backInUp animate__slow">
        <div className="home-wrap-img animate__animated animate__fadeInDown animate__delay-1s">
          <img src="/img/logo/mochimochi-mochidemy.gif" alt="" />
        </div>
        <div className="home-wrap-font animate__animated animate__fadeInDown animate__delay-2s">
          Chào mừng bạn đến với MochiMochi
        </div>
        <div className="home-wrap-font animate__animated animate__fadeInDown animate__delay-2s">
          bấm vào đây để học từ mới
        </div>
        <Link
          onClick={() => {
            dispatch(changeIsActive("new-word")), clickAudio.play();
          }}
          to={"/new-word/1"}
          className="home-wrap-button-contain animate__animated animate__fadeInDown animate__delay-2s"
        >
          <div className="home-wrap-button">HỌC TỪ MỚI</div>
        </Link>
      </div>
      <img
        className="arrow-button animate__animated animate__fadeInLeft animate__delay-3s"
        src="/img/logo/arrow-button.gif"
        alt=""
      />
    </div>
  );
}

export default Home;
