import React, { useState, useContext } from "react";

import "./PlaceItem.css";
import Card from "../../shared/components/UIelements/Card/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIelements/Modal/Modal";
import LoadingSpinner from "../../shared/components/UIelements/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../shared/components/UIelements/LoadingSpinner/ErrorModal";
import { AuthContext } from "../../shared/components/context/auth-context";
import { useHttpClient } from "../../shared/components/hooks/http-hook";

const PlaceItem = (props) => {
  const { loading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const [showMap, setShowMap] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const showMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const showDeleteConfirmHandler = () => setShowConfirm(true);
  const cancelDeleteHandler = () => setShowConfirm(false);

  const confirmDeleteHandler = async () => {
    setShowConfirm(false);
    try {
      await sendRequest(process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`, "DELETE", null, {
        Authorization: "Bearer " + auth.token,
      });
      props.onDelete(props.id);
    } catch (error) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {showMap && (
        <Modal
          show={showMapHandler}
          onCancel={closeMapHandler}
          header={props.address}
          contentClass="place-item__modal-content"
          footerClass="place-item__modal-actions"
          footer={<Button onClick={closeMapHandler}>Close</Button>}
        >
          <div className="map-container">
            <h2>The Map!</h2>
          </div>
        </Modal>
      )}
      <Modal
        show={showConfirm}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete the place ? please note that it can't be undone
          thereafter
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {loading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.desc}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={showMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteConfirmHandler}>
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
