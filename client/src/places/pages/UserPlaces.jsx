import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIelements/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../shared/components/UIelements/LoadingSpinner/ErrorModal";

import PlaceList from "../components/PlaceList";

const UserPlaces = () => {
  const [userPlaces, setUserPlaces] = useState();

  const { loading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );

        setUserPlaces(responseData.places);
      } catch (error) {}
    };

    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHander = (deletedPlaceId) => {
    setUserPlaces((prevPlaces) => prevPlaces.filter((place) => place.id !== deletedPlaceId));
  };

  return (
    <>
      {loading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      <ErrorModal error={error} onClear={clearError} />

      {!loading && userPlaces && (
        <PlaceList items={userPlaces} onDeletePlace={placeDeletedHander} />
      )}
    </>
  );
};

export default UserPlaces;
