import { userSignUp } from "./authSlice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForms } from "./useForms";
import { useDispatch, useSelector } from "react-redux";
import { CgSpinnerAlt } from "react-icons/cg";
import logo from "../../assets/pulse-logo.svg";

export const SignUp = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: ""
  });

  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const signUpStatus = useSelector(state => state.auth.signUpStatus);
  const error = useSelector(state => state.auth.error);
  const navigate = useNavigate();

  useEffect(() => {
    if (signUpStatus === "succeeded") {
      localStorage?.setItem("login", JSON.stringify({ token }));
      navigate("/");
    }
  }, [signUpStatus, navigate, token]);

  const signUp = async () => {
    if (signUpStatus === "idle" || signUpStatus === "failed") {
      dispatch(userSignUp(userDetails));
    }
  };

  const {
    touchedFields,
    handleOnChange,
    handleOnBlur,
    validateSignUp,
    isBtnDisabled
  } = useForms(setUserDetails);

  function handleSignUp(e) {
    e.preventDefault();

    signUp();
  }
  const errors = validateSignUp(userDetails);

  const shouldShowErrors = field => {
    return errors[field] ? touchedFields[field] : false;
  };

  const getInputClassName = field => {
    return shouldShowErrors(field)
      ? "border border-red-500 p-1 rounded mb-0.5"
      : "border border-gray-400 p-1 rounded mb-0.5";
  };
  return (
    <div className="flex flex-col justify-center items-center mx-3 mb-8">
      <div className="flex w-full justify-center">
        <img className="w-12 mr-2" src={logo} alt="" />
        <p className="text-primary text-5xl font-semibold my-8">Pulse Social</p>
      </div>
      <p className="mb-6 text-lg">
        Sign Up with <span className="text-primary">Pulse Social</span>
      </p>
      <form
        onSubmit={handleSignUp}
        className="border border-gray-300 shadow p-2 sm:px-3 sm:py-4 flex flex-col items-center rounded w-full sm:w-3/4 md:w-2/4  max-w-md"
        noValidate
      >
        <div className="flex flex-col mb-4 w-full">
          <label className="mb-1 text-gray-600">First Name</label>
          <input
            type="text"
            className={getInputClassName("firstName")}
            onChange={handleOnChange("firstName")}
            onBlur={() => handleOnBlur("firstName")}
          />
          {shouldShowErrors("firstName") && (
            <InputError error={errors.firstName} />
          )}
        </div>

        <div className="flex flex-col mb-4 w-full">
          <label className="mb-1 text-gray-600">Last Name</label>
          <input
            type="text"
            className={getInputClassName("lastName")}
            onChange={handleOnChange("lastName")}
            onBlur={() => handleOnBlur("lastName")}
          />
          {shouldShowErrors("lastName") && (
            <InputError error={errors.lastName} />
          )}
        </div>

        <div className="flex flex-col mb-4 w-full">
          <label className="mb-1 text-gray-600">Username</label>
          <input
            type="text"
            className={getInputClassName("userName")}
            onChange={handleOnChange("userName")}
            onBlur={() => handleOnBlur("userName")}
          />
          {shouldShowErrors("userName") && (
            <InputError error={errors.lastName} />
          )}
        </div>

        <div className="flex flex-col mb-4 w-full">
          <label className="mb-1 text-gray-600">Email</label>
          <input
            type="email"
            className={getInputClassName("email")}
            required
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
            required
            onChange={handleOnChange("password")}
            onBlur={() => handleOnBlur("password")}
          />
          {shouldShowErrors("password") && (
            <InputError error={errors.password} />
          )}
        </div>

        {signUpStatus === "failed" && (
          <p className="text-red-500 border border-red-500 my-2 w-full p-1 pl-2 border-l-8 font-semibold">
            {error}
          </p>
        )}

        <div className="w-full mt-3">
          <button
            className="w-full bg-primary py-1.5 text-white flex justify-center rounded transition-all hover:opacity-80"
            type="submit"
            disabled={isBtnDisabled(errors)}
          >
            {signUpStatus === "loading" ? (
              <CgSpinnerAlt className="animate-spin text-white text-2xl" />
            ) : (
              "Sign Up"
            )}
          </button>
        </div>
        <div className="mt-4">
          Already have an account ?{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
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
