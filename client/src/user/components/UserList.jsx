import React from "react";

import UserItem from "./UserItem";
import Card from "../../shared/components/UIelements/Card/Card";
import "./UserList.css";

function UserList(props) {
  if (props.item.length === 0) {
    return (
      <Card>
        <div className="center">
          <h2>No user found</h2>
        </div>
      </Card>
    );
  }

  return (
    <ul className="user-list">
      {props.item.map((user) => {
        return (
          <UserItem
            key={user.id}
            id={user.id}
            image={user.image}
            name={user.name}
            placeCount={user.places.length}
          />
        );
      })}
    </ul>
  );
}

export default UserList;
