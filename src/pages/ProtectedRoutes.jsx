import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoutes = ({ children }) => {
    const user = useSelector(state => state.auth.user)
    console.log("ProtectedRoutes user:", user)

    return user ? children : <Navigate to="/login" />
}

export default ProtectedRoutes
