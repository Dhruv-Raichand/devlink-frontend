import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { Flip, ToastContainer, toast } from "react-toastify";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const notify = (msg) =>
    toast.success(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      transition: Flip,
    });
  const notifyErr = (msg) =>
    toast.error(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      progress: undefined,
      theme: "colored",
      transition: Flip,
    });

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName,
          lastName,
          emailId,
          password,
        },
        { withCredentials: true }
      );
      notify("Registered Successfull !");
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      notifyErr(err.response.data);
      setError(err.response.data);
      console.log(err);
    }
  };
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
      notifyErr(err.response.data);
      setError(err.response.data);
      console.log(err);
    }
  };

  return (
    <>
      <div>
        {error && <ToastContainer />}
        <div className="card bg-base-300 w-96 shadow-sm mx-auto my-20">
          <div className="card-body flex flex-col justify-center items-center ">
            <h2 className="card-title">{isLogging ? "Login" : "Sign Up"}</h2>

            <div className="min-w-80">
              {!isLogging && (
                <>
                  <fieldset className="fieldset w-full my-2">
                    <legend className="fieldset-legend">First Name</legend>
                    <input
                      type="text"
                      className="input"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Type here"
                    />
                  </fieldset>
                  <fieldset className="fieldset w-full my-2">
                    <legend className="fieldset-legend">Last Name</legend>
                    <input
                      type="text"
                      className="input"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Type here"
                    />
                  </fieldset>
                </>
              )}
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
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type here"
                />
              </fieldset>
              {error && <p className="text-red-500">{error}</p>}
            </div>
            <div className="card-actions justify-center">
              <button
                className="btn btn-primary m-2"
                onClick={isLogging ? handleLogin : handleSignUp}>
                {isLogging ? "Login" : "Sign Up"}
              </button>
            </div>
            <p onClick={() => setIsLogging(!isLogging)}>
              {isLogging
                ? "Not have an account? Sign Up"
                : "Already have an account? Login"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
