import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceForm.css";
import ErrorModal from "../../shared/components/UIelements/LoadingSpinner/ErrorModal";
import LoadingSpinner from "../../shared/components/UIelements/LoadingSpinner/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { useForm } from "../../shared/components/hooks/form-hooks";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import { AuthContext } from "../../shared/components/context/auth-context";
import { useContext } from "react";
import { useHistory } from "react-router-dom";

// const formReducer = (state, action) => {
//   switch (action.type) {
//     case "INPUT_CHANGE":
//       return {
//         ...state,
//         inputs: {
//           ...state.inputs,
//           [action.inputId]: { value: action.value },
//         },
//       };

//     default:
//       return state;
//   }
// };

function NewPlaces() {
  const auth = useContext(AuthContext);
  const { loading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm({
    title: { value: "" },
    description: { value: "" },
    address: { value: "" },
    image: { value: null },
  });
  const history = useHistory();

  // const [state, dispatch] = useReducer(formReducer, {
  //   inputs: {
  //     title: { value: "" },
  //     description: { value: "" },
  //     address: { value: "" },
  //   },
  // });

  // const titleInputHandler = useCallback((id, value, isValid) => {
  //   dispatch({ type: "INPUT_CHANGE", inputId: id, value: value });
  // }, []);

  const submitHandler = async (event) => {
    event.preventDefault();
    console.log(process.env.REACT_APP_BACKEND_URL);
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);

      formData.append("image", formState.inputs.image.value);

      await sendRequest(process.env.REACT_APP_BACKEND_URL + "/places", "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });
      history.push("/");
    } catch (error) {}
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form">
        {loading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="title"
          validators={[]}
          errorText="plz enter a valid title "
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          type="text"
          label="Description"
          validators={[]}
          errorText="plz enter a valid desc "
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[]}
          errorText="plz enter a valid address "
          onInput={inputHandler}
        />
        <ImageUpload id="image" onInput={inputHandler} errorText="Please provide an image" />
        <Button type="submit" onClick={submitHandler}>
          Add Place
        </Button>
      </form>
    </>
  );
}

export default NewPlaces;
