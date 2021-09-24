import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "./authSlice";
import { useForms } from "./useForms";
import { CgSpinnerAlt } from "react-icons/cg";
import logo from "../../assets/pulse-logo.svg";

export const Login = () => {
  const loginStatus = useSelector(state => state.auth.loginStatus);
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: ""
  });
  const error = useSelector(state => state.auth.error);

  const token = useSelector(state => state.auth.token);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (loginStatus === "succeeded") {
      localStorage?.setItem("login", JSON.stringify({ token }));
      navigate("/");
    }
  }, [loginStatus, token, navigate]);

  const login = () => {
    if (loginStatus === "idle" || loginStatus === "failed") {
      dispatch(userLogin(userDetails));
    }
  };

  const {
    touchedFields,
    handleOnChange,
    handleOnBlur,
    validateLogin,
    isBtnDisabled
  } = useForms(setUserDetails);

  const handleSubmit = e => {
    e.preventDefault();
    login();
  };
  const errors = validateLogin(userDetails.email, userDetails.password);

  const shouldShowErrors = field => {
    return errors[field] ? touchedFields[field] : false;
  };
  const getInputClassName = field => {
    return shouldShowErrors(field)
      ? "border border-red-500 p-1 rounded mb-0.5"
      : "border border-gray-400 p-1 rounded mb-0.5";
  };
  return (
    <div className="flex flex-col justify-center items-center mx-3">
      <div className="flex w-full justify-center">
        <img className="w-12 mr-2" src={logo} alt="" />
        <p className="text-primary text-5xl font-semibold my-8">Pulse Social</p>
      </div>
      <p className="mb-8 text-lg">
        <span className="text-primary">Login</span> to your account
      </p>
      <form
        onSubmit={handleSubmit}
        className="border border-gray-300 shadow p-2 sm:px-3 sm:py-4 flex flex-col items-center rounded w-full sm:w-3/4 md:w-2/4 lg:w-1/4 max-w-md"
      >
        <div className="flex flex-col mb-4 w-full">
          <label className="mb-1 text-gray-600">Email</label>
          <input
            type="email"
            className={getInputClassName("email")}
            onChange={handleOnChange("email")}
            onBlur={() => handleOnBlur("email")}
          />
          {shouldShowErrors("email") && <InputError error={errors.email} />}
        </div>

        <div className="flex flex-col mb-4 w-full">
          <label className="mb-1 text-gray-600">Password</label>
          <input
            type="password"
            className={getInputClassName("password")}
            onChange={handleOnChange("password")}
            onBlur={() => handleOnBlur("password")}
          />
          {shouldShowErrors("password") && (
            <InputError error={errors.password} />
          )}
        </div>

        {loginStatus === "failed" && (
          <p className="text-red-500 border border-red-500 my-2 w-full p-1 pl-2 border-l-8 font-semibold">
            {error}
          </p>
        )}

        <div className="w-full mt-3">
          <button
            type="submit"
            disabled={isBtnDisabled(errors)}
            className="w-full bg-primary py-1.5 text-white flex justify-center rounded transition-all hover:opacity-80"
          >
            {loginStatus === "loading" ? (
              <CgSpinnerAlt className="animate-spin text-white text-2xl" />
            ) : (
              "Login"
            )}
          </button>
        </div>
        <div className="mt-4">
          Don't have an account ?{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </div>
      </form>
    </div>
  );
};
export const InputError = ({ error }) => {
  return (
    <span role="alert" className="text-red-500 text-sm">
      {error}
    </span>
  );
};
