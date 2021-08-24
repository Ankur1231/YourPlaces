import React, { useState, useContext } from "react";
import "./Auth.css";
import Card from "../../shared/components/UIelements/Card/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/components/hooks/form-hooks";
import { AuthContext } from "../../shared/components/context/auth-context";
import ErrorModal from "../../shared/components/UIelements/LoadingSpinner/ErrorModal";
import LoadingSpinner from "../../shared/components/UIelements/LoadingSpinner/LoadingSpinner";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const Auth = () => {
  const auth = useContext(AuthContext);

  const [logIn, setLogIn] = useState(true);
  const { loading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm({
    email: {
      value: "",
    },
    password: {
      value: "",
    },
    image: {
      value: null,
    },
  });

  const submitHandler = async (event) => {
    event.preventDefault();

    //LOGIN REQUEST
    if (logIn) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );

        //Sending the userId and the token to the login function in App.js
        auth.login(responseData.userId, responseData.token);
      } catch (error) {}
    }
    // SIGNUP REQUEST
    else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          formData
        );

        //Sending the userId and the token to the login function in App.js
        auth.login(responseData.userId, responseData.token);
      } catch (error) {}
    }
  };

  const switchModeHandler = () => {
    setLogIn((prev) => !prev);
  };

  const errorHandler = () => {
    clearError();
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="authentication">
        {loading && <LoadingSpinner asOverlay />}
        <h2>Login required</h2>
        <hr />
        <form>
          {!logIn && (
            <Input element="input" id="name" type="text" label="name" onInput={inputHandler} />
          )}
          {!logIn && (
            <ImageUpload
              id="image"
              center
              onInput={inputHandler}
              errorText="Please provide an image"
            />
          )}
          <Input element="input" id="email" type="email" label="email" onInput={inputHandler} />
          <Input
            element="input"
            id="password"
            type="password"
            label="password"
            onInput={inputHandler}
          />

          <Button type="submit" onClick={submitHandler}>
            {logIn ? "LogIn" : "Singup"}
          </Button>
        </form>

        <Button inverse onClick={switchModeHandler}>
          {logIn ? "Switch to signup" : "Switch to Login"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
