import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth/index.jsx"
import Home from "./pages/home/index.jsx"
import Profile from "./pages/profile/index.jsx"
import AddPost from "./pages/add-post/index.jsx"
import useAppStore from './store/index.js';
import { apiClient } from './lib/api-client.js';
import { GET_USER_INFO } from './utils/constant.js';
import Search from './pages/search/index.jsx';
import OpenId from './pages/open-id/index.jsx';
import Saved from './pages/saved/index.jsx';
import NetClips from './pages/net-clips/index.jsx';


const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/home" /> : children;
};

const App = () => {

  const { userInfo, setUserInfo,darkMode } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });
        // console.log({ response });
        if (response.status == 200 && response.data.user._id) {
          setUserInfo(response.data.user)
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        console.log({ error });
        setUserInfo(undefined);
      } finally {
        setLoading(false)
      }
    }
    if (!userInfo) {
      getUserInfo();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className={`${darkMode && "dark"}`}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/auth"
              element={
                <AuthRoute>
                  <Auth />
                </AuthRoute>
              }
            />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <Search />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-post"
              element={
                <PrivateRoute>
                  <AddPost />
                </PrivateRoute>
              }
            />
            <Route
              path="/net-clips"
              element={
                <PrivateRoute>
                  <NetClips />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/saved"
              element={
                <PrivateRoute>
                  <Saved />
                </PrivateRoute>
              }
            />
            <Route
              path="/open-id"
              element={
                <PrivateRoute>
                  <OpenId />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        </BrowserRouter>
      </div></>
  )
}

export default App