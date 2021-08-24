import React, { useState, useCallback, useEffect, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

// import NewPlaces from "./places/pages/NewPlaces";
// import UserPlaces from "./places/pages/UserPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/components/context/auth-context";
import LoadingSpinner from "./shared/components/UIelements/LoadingSpinner/LoadingSpinner";

const Users = React.lazy(() => import("./user/pages/Users"));
const NewPlaces = React.lazy(() => import("./places/pages/NewPlaces"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./user/pages/Auth"));

let logoutTimer;

function App() {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  // setting the login state and sending data to the context API for whole app to use
  const login = useCallback((uid, token, expirationDate) => {
    // since we are using tokens i,e token is only generated if the email ,password are correct
    // so existance of token signifies that the credentials were correct and the user is logged in
    // + we are alse setting the isLogged in value using token existance in authContext to true and false
    setToken(token);

    // either get the already stored expiration date or
    // get current time + 1hrs coz our token expires in 1 hr so this is the time when token expires
    //diff variable coz scoping
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);

    setTokenExpirationDate(tokenExpirationDate);

    //store the token in local storage
    localStorage.setItem(
      "userData",
      JSON.stringify({ userId: uid, token: token, expiration: tokenExpirationDate.toISOString() })
    );
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    // remove token when log out
    localStorage.removeItem("userData");
  }, []);

  //Auto Logout
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  //Auto Login
  useEffect(() => {
    //The JSON.stringify() method converts a JavaScript object or value into a JSON string
    //whereas JSON.parse() method parses a JSON string into a JavaScript object.
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlaces />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>

        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>

        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <>
      <AuthContext.Provider
        // !! converts the value to boolean i,e if token exist it will be true and vicevers
        value={{ isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout }}
      >
        <MainNavigation />
        <main>
          {" "}
          <Suspense
            fallback={
              <div>
                <LoadingSpinner />
              </div>
            }
          >
            {" "}
            {routes}
          </Suspense>
        </main>
      </AuthContext.Provider>
    </>
  );
}

export default App;
