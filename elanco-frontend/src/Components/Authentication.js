import React, { useState } from "react";
import "../login-sign-up.css";
import { signIn, signUp } from "../html";
import { Link, useNavigate } from "react-router-dom";

const originalRegisterForm = {
  email: "",
  password: "",
  confirmPassword: "",
  forename: "",
};

const originalSignInForm = {
  email: "",
  password: "",
};

const originalErrors = {
  loginEmailError: "",
  loginPasswordError: "",
  signUpEmailError: "",
  signUpPasswordError: "",
  signUpConfirmPasswordError: "",
};
const SignupLogin = ({ originalMode }) => {
  const nav = useNavigate();
  const [mode, setMode] = useState(originalMode);
  const [signInForm, setSignInForm] = useState(originalSignInForm);
  const [register, setRegister] = useState(originalRegisterForm);
  const [errors, setErrors] = useState(originalErrors);
  const onSignIn = (e) => {
    e.preventDefault();

    let newErrors = {
      ...originalErrors,
    };
    signIn(signInForm)
      .then((e) => {
        localStorage.setItem("account", JSON.stringify(e.data.user));
        nav(`/`);
      })
      .catch((error) => {
        console.log(error);
        if (signInForm.email === "") {
          newErrors = {
            ...newErrors,
            loginEmailError: "You must include your email",
          };
        } else if (error.response.data.message === "User not found") {
          newErrors = {
            ...newErrors,
            loginEmailError: "Your email was not found",
          };
        }

        if (!signInForm.password) {
          newErrors = {
            ...newErrors,
            loginPasswordError: "You must include your password",
          };
        } else if (error.response.data.message === "Invalid Password") {
          newErrors = {
            ...newErrors,
            loginPasswordError: "Your password is incorrect",
          };
        }
        setErrors(newErrors);
      });
  };
  const onSignUp = (e) => {
    e.preventDefault();

    let newErrors = {
      ...originalErrors,
    };
    if (register.password === "") {
      newErrors.signUpPasswordError = "You must include a password";
    }

    if (register.email === "") {
      newErrors.signUpEmailError = "You must include your email";
    }

    signUp(register)
      .then((e) => {
        localStorage.setItem("account", JSON.stringify(e.data.user));
        nav("/");
      })
      .catch((error) => {
        if (error.response.data.message === "This email is already taken!") {
          newErrors.signUpEmailError = "This email is already taken";
        }
        if (
          error.response.data.message ===
          "The password must be at least 8 characters long"
        ) {
          newErrors.signUpPasswordError = error.response.data.message;
        } else if (
          error.response.data.message == "The passwords do not match"
        ) {
          newErrors.signUpConfirmPasswordError = error.response.data.message;
        }
        setErrors(newErrors);
      });
  };
  return (
    <section class="auth-section">
      {mode === "register" ? (
        <div class="auth-container">
          <div class="auth-header">
            <img src="/Elanco.png" width="110" height="55" />
            <h2> with Elanco Rebates</h2>
          </div>
          <form class="auth-card" id="registerForm" onSubmit={onSignUp}>
            <div class="form-fields">
              <div class="validation-message-summary"></div>
              <div class="form-field">
                <label class="form-label">
                  Email <span>*</span>
                </label>
                <input
                  class="form-control"
                  value={register.email}
                  onChange={(e) =>
                    setRegister({ ...register, email: e.target.value })
                  }
                  type="email"
                />
                <p
                  className={`invalid-message ${
                    errors.signUpEmailError !== "" && "show"
                  }`}
                >
                  {errors.signUpEmailError}
                </p>
              </div>
              <div class="form-field">
                <label asp-for="Input.Password" class="form-label">
                  Password <span>*</span>
                </label>
                <input
                  type="password"
                  class="form-control"
                  value={register.password}
                  onChange={(e) =>
                    setRegister({ ...register, password: e.target.value })
                  }
                />
                <p
                  className={`invalid-message ${
                    errors.signUpPasswordError !== "" && "show"
                  }`}
                >
                  {errors.signUpPasswordError}
                </p>
              </div>
              <div class="form-field">
                <label class="form-label">
                  Confirm Password <span>*</span>
                </label>
                <input
                  type="password"
                  class="form-control"
                  value={register.confirmPassword}
                  onChange={(e) =>
                    setRegister({
                      ...register,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <p
                  className={`invalid-message ${
                    errors.signUpConfirmPasswordError !== "" && "show"
                  }`}
                >
                  {errors.signUpConfirmPasswordError}
                </p>
                <span class="validation-message"></span>
              </div>
              <div class="form-field">
                <label class="form-label">
                  First name <span>*</span>
                </label>
                <input
                  type="password"
                  class="form-control"
                  value={register.forename}
                  onChange={(e) =>
                    setRegister({
                      ...register,
                      forename: e.target.value,
                    })
                  }
                />
                <span class="validation-message"></span>
              </div>
              <div class="form-submit-btn-container">
                <button id="auth-submit" type="submit">
                  Register
                </button>
              </div>
            </div>
          </form>
          <div
            class="auth-card"
            style={{ cursor: "pointer" }}
            onClick={() => setMode("login")}
          >
            <p>
              Already have an account?<a> Log in</a>
            </p>
          </div>
        </div>
      ) : (
        <div class="auth-container">
          <div class="auth-header">
            <img src="/Elanco.png" width="100" height="50" />
            <h2>Log in to Elanco Rebates</h2>
          </div>
          <form class="auth-card" id="account" onSubmit={onSignIn}>
            <div class="form-fields">
              <div class="validation-message-summary"></div>
              <div class="form-field">
                <label class="form-label">
                  Email <span>*</span>
                </label>
                <input
                  class="form-control"
                  value={signInForm.email}
                  onChange={(e) =>
                    setSignInForm({ ...signInForm, email: e.target.value })
                  }
                />
                <p
                  className={`invalid-message ${
                    errors.loginEmailError !== "" && "show"
                  }`}
                >
                  {errors.loginEmailError}
                </p>
              </div>
              <div class="form-field">
                <label class="form-label">
                  Password <span>*</span>
                </label>
                <input
                  type="password"
                  value={signInForm.password}
                  onChange={(e) =>
                    setSignInForm({ ...signInForm, password: e.target.value })
                  }
                  class="form-control"
                />
                <p
                  className={`invalid-message ${
                    errors.loginPasswordError !== "" && "show"
                  }`}
                >
                  {errors.loginPasswordError}
                </p>
              </div>
              <div class="form-submit-btn-container">
                <button id="auth-submit" type="submit">
                  Log in
                </button>
              </div>
            </div>
          </form>
          <div
            class="auth-card"
            style={{ cursor: "pointer" }}
            onClick={() => setMode("register")}
          >
            <p>
              Not got an account?<a>Register</a>
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default SignupLogin;
