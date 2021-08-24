import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../shared/components/context/auth-context";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/components/hooks/form-hooks";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIelements/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../shared/components/UIelements/LoadingSpinner/ErrorModal";
import "./PlaceForm.css";

const UpdatePlace = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [loadedPlace, setLoadedPlace] = useState();
  const { loading, error, sendRequest, clearError } = useHttpClient();
  const placeId = useParams().placeId;
  const [formState, inputHandler, setFormData] = useForm({
    title: {
      value: "",
    },
    description: {
      value: "",
    },
  });

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );

        setLoadedPlace(responseData.place);
        setFormData({
          title: {
            value: responseData.place.title,
          },
          description: {
            value: responseData.place.description,
          },
        });
      } catch (error) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  if (loading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace) {
    return <h2>No place found</h2>;
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        { "Content-Type": "application/json", Authorization: "Bearer " + auth.token }
      );
      history.push("/" + auth.userId + "/places");
    } catch (error) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!loading && loadedPlace && (
        <form className="place-form">
          <Input
            id="title"
            element="input"
            type="text"
            lable="title"
            errorText="plz enter a valid title"
            onInput={inputHandler}
            value={loadedPlace.title}
          />
          <Input
            id="description"
            element="textarea"
            lable="title"
            errorText="plz enter a valid desc"
            onInput={inputHandler}
            value={loadedPlace.description}
          />
          <Button type="submit" onClick={submitHandler}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
