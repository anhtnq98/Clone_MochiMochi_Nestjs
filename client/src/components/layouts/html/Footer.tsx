import "../css/Footer.css";

function Footer() {
  return (
    <footer
      className="text-center text-white animate__animated animate__fadeInUp animate__delay-2s"
      style={{
        background:
          "linear-gradient(to bottom, #FFA500 0%, #FFCB08 56%, #FFCB08 100%)",
        zIndex: "555",
      }}
    >
      {/* Grid container */}
      <div className="container p-4 footer-wrapper">
        {/* Section: Images */}
        <section className="">
          <div className="row">
            <div className="col-lg-2 col-md-12 mb-4 mb-md-0">
              <div
                className="bg-image hover-overlay ripple shadow-1-strong rounded"
                data-ripple-color="dark"
              >
                <img src="https://firebasestorage.googleapis.com/v0/b/mochimochi-clone.appspot.com/o/footer-img%2F04.jpeg?alt=media&token=b63a08fe-7914-4cc7-8354-077ec2855d16" />
                <a href="#!">
                  <div
                    className="mask"
                    style={{ backgroundColor: "rgba(251, 251, 251, 0.2)" }}
                  />
                </a>
              </div>
            </div>
            <div className="col-lg-2 col-md-12 mb-4 mb-md-0">
              <div
                className="bg-image hover-overlay ripple shadow-1-strong rounded"
                data-ripple-color="dark"
              >
                <img src="https://firebasestorage.googleapis.com/v0/b/mochimochi-clone.appspot.com/o/footer-img%2F02.jpg?alt=media&token=241deb2a-4be2-4ee8-b39a-1e4b9caaf89d" />
                <a href="#!">
                  <div
                    className="mask"
                    style={{ backgroundColor: "rgba(251, 251, 251, 0.2)" }}
                  />
                </a>
              </div>
            </div>
            <div className="col-lg-2 col-md-12 mb-4 mb-md-0">
              <div
                className="bg-image hover-overlay ripple shadow-1-strong rounded"
                data-ripple-color="dark"
              >
                <img src="https://firebasestorage.googleapis.com/v0/b/mochimochi-clone.appspot.com/o/footer-img%2F03.jpg?alt=media&token=6fab5caa-4180-4931-9b5d-03501df816dc" />
                <a href="#!">
                  <div
                    className="mask"
                    style={{ backgroundColor: "rgba(251, 251, 251, 0.2)" }}
                  />
                </a>
              </div>
            </div>
            <div className="col-lg-2 col-md-12 mb-4 mb-md-0">
              <div
                className="bg-image hover-overlay ripple shadow-1-strong rounded"
                data-ripple-color="dark"
              >
                <img src="https://firebasestorage.googleapis.com/v0/b/mochimochi-clone.appspot.com/o/footer-img%2F01.jpg?alt=media&token=125e2154-8f7d-4a28-9f61-dc19977dc6ec" />
                <a href="#!">
                  <div
                    className="mask"
                    style={{ backgroundColor: "rgba(251, 251, 251, 0.2)" }}
                  />
                </a>
              </div>
            </div>
            <div className="col-lg-2 col-md-12 mb-4 mb-md-0">
              <div
                className="bg-image hover-overlay ripple shadow-1-strong rounded"
                data-ripple-color="dark"
              >
                <img src="https://firebasestorage.googleapis.com/v0/b/mochimochi-clone.appspot.com/o/footer-img%2F05.jpg?alt=media&token=09a587a1-d94e-4a7b-a7ed-6c235304e75a" />
                <a href="#!">
                  <div
                    className="mask"
                    style={{ backgroundColor: "rgba(251, 251, 251, 0.2)" }}
                  />
                </a>
              </div>
            </div>
            <div className="col-lg-2 col-md-12 mb-4 mb-md-0">
              <div
                className="bg-image hover-overlay ripple shadow-1-strong rounded"
                data-ripple-color="dark"
              >
                <img src="https://firebasestorage.googleapis.com/v0/b/mochimochi-clone.appspot.com/o/footer-img%2F06.png?alt=media&token=7c59f71e-9eb1-4ff4-9522-6046b8e57d45" />
                <a href="#!">
                  <div
                    className="mask"
                    style={{ backgroundColor: "rgba(251, 251, 251, 0.2)" }}
                  />
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* Section: Images */}
      </div>
      {/* Grid container */}
      {/* Copyright */}
      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        © 2020 Copyright: MochiMochi.com
      </div>
      {/* Copyright */}
    </footer>
  );
}

export default Footer;
