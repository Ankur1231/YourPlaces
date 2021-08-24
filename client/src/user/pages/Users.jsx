import React, { useEffect, useState } from "react";
import "../components/UserList";
import UserList from "../components/UserList";
import ErrorModal from "../../shared/components/UIelements/LoadingSpinner/ErrorModal";
import LoadingSpinner from "../../shared/components/UIelements/LoadingSpinner/LoadingSpinner";
import { useHttpClient } from "../../shared/components/hooks/http-hook";

function Users() {
  const [userData, setUserData] = useState();
  const { loading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + "/users");

        setUserData(responseData.users);
      } catch (error) {}
    };

    fetchUsers();
  }, [sendRequest]);

  const errorHandler = () => {
    clearError();
  };

  return (
    <>
      {loading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <ErrorModal error={error} onClear={errorHandler} />
      {!loading && userData && <UserList item={userData} />}
    </>
  );
}

export default Users;
