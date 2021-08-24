import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value },
        },
      };

    case "SET_DATA":
      return {
        inputs: action.inputs,
      };

    default:
      return state;
  }
};

export const useForm = (initialInputs) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({ type: "INPUT_CHANGE", inputId: id, value: value });
  }, []);

  const setFormData = useCallback((inputData) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
    });
  }, []);

  return [formState, inputHandler, setFormData];
};
