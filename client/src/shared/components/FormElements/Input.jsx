import React, { useReducer, useEffect } from "react";

import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.value || "",
    isValid: false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({ type: "CHANGE", val: event.target.value });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        value={inputState.value}
      />
    );

  return (
    <div className={`form-control ${!inputState.isValid && "form-control--invalid"} `}>
      <label htmlFor={props.id}>{props.label}</label>
      {element}

      {!inputState.isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
