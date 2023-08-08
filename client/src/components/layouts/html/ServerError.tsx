import { useSelector } from "react-redux";
import { RootState } from "../../../unity/store";

function ServerError() {
  const currentUser = useSelector((state: RootState) => {
    return state.user.value;
  });
  console.log(currentUser);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src="./img/logo/error-500.png"
        alt=""
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}

export default ServerError;
