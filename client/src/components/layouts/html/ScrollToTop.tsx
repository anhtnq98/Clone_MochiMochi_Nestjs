import "../css/ScrollToTop.css";
function ScrollToTop() {
  return (
    <>
      <img
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Trở về đầu trang"
        className="to-top"
        src="/img/logo/to-top.png"
        alt=""
      />
    </>
  );
}

export default ScrollToTop;
