import React from "react";

import "./PlaceList.css";
import Card from "../../shared/components/UIelements/Card/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";

const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No Places found. Maybe Add some</h2>
          <Button>Add Places</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((item) => {
        return (
          <PlaceItem
            key={item.id}
            id={item.id}
            title={item.title}
            image={item.image}
            desc={item.description}
            address={item.address}
            creatorId={item.creator}
            coordinates={item.location}
            onDelete={props.onDeletePlace}
          />
        );
      })}
    </ul>
  );
};

export default PlaceList;
