import React from 'react';
import {Redirect, Route} from "react-router-dom";
import jwt from 'jsonwebtoken'

function ProtectedRoute({children, ...rest}) {

    return (
        <Route
            {...rest}
            render={({location}) =>
                verifyToken(localStorage.getItem('token')) ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/sign-in",
                            state: {from: location}
                        }}
                    />
                )
            }
        />);
}

function verifyToken(token) {
    if (!token)
        return false
    const decoded = jwt.decode(token)
    const currentDate = Date.now()
    const {iat} = decoded
    if (currentDate / 1000 + 60 * 60 <= iat) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        return false
    }
    return true
}

export default ProtectedRoute;
