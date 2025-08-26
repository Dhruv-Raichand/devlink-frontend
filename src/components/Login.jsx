import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const [emailId, setEmailId] = useState("jaat@email.com");
  const [password, setPassword] = useState("@Jaat5911");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const notify = (msg) => toast(msg);

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      notify("Login Successfull !");
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      errorNotify(err.response.data);
      setError(err.response.data);
      console.log(err);
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
        <div className="card bg-base-300 w-96 shadow-sm mx-auto my-20">
          <div className="card-body flex flex-col justify-center items-center ">
            <h2 className="card-title">Login</h2>

            <div className="min-w-80">
              <fieldset className="fieldset w-full my-2">
                <legend className="fieldset-legend">Email</legend>
                <input
                  type="text"
                  className="input"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  placeholder="Type here"
                />
              </fieldset>
              <fieldset className="fieldset w-full my-2">
                <legend className="fieldset-legend">Password</legend>
                <input
                  type="text"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type here"
                />
              </fieldset>
              {error && <p className="text-red-500">{error}</p>}
            </div>
            <div className="card-actions justify-center">
              <button className="btn btn-primary m-2" onClick={handleLogin}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
