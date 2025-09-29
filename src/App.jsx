import Signup from "./pages/Signup"
import './App.css'
import Login from "./pages/Login"

import Home from "./pages/Home"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoutes from "./pages/ProtectedRoutes"
import Layout from "./pages/Layout"
import VideoPlayer from "./pages/videoPlayer"
import VideoCreate from "./pages/VideoCreate"
import History from "./pages/History"
import Profile from "./pages/Profile"
import Tweets from "./pages/Tweets"


import Search from "./pages/Search"

import EditTweet from "./pages/Edittweet"
import EditProfile from "./pages/Edit"
import Edit from "./pages/editVideo"
function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <Signup />
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoutes><Home /></ProtectedRoutes>
          )
        },
        {
          path: "/video/:id",
          element: (
            <ProtectedRoutes><VideoPlayer /></ProtectedRoutes>
          )
        },
        {
          path: "/create",
          element: (
            <ProtectedRoutes><VideoCreate /></ProtectedRoutes>
          )
        },
        {
          path: "/history",
          element: (
            <ProtectedRoutes><History /></ProtectedRoutes>
          )
        },
         {
          path: "/profile/:username",
          element: (
            <ProtectedRoutes><Profile /></ProtectedRoutes>
          )
        },
         {
          path: "/tweet",
          element: (
            <ProtectedRoutes><Tweets /></ProtectedRoutes>
          )
        },
           {
          path: "/edit",
          element: (
            <ProtectedRoutes><EditProfile/></ProtectedRoutes>
          )
        },
         {
          path: "/search",
          element: (
            <ProtectedRoutes><Search /></ProtectedRoutes>
          )
        },
        {

         path:"/edit/video/:id",
          element:<ProtectedRoutes><Edit/></ProtectedRoutes>
        },
         {

         path:"/edit/tweet/:tweetId",
          element:<ProtectedRoutes><EditTweet /></ProtectedRoutes>
        },

        
      ]
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
