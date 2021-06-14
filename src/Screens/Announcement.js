import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  PageHeader
} from 'antd';
import {
    BrowserRouter, Switch, Route, NavLink, useHistory,useParams,
  } from 'react-router-dom';
import {
    getToken, getUser, removeUserSession, setUserSession,
  } from '../Utils/Common';


function Announcement() {
    const history = useHistory();
    useEffect(() => {
    
        const token = getToken();
        if (!token) {
        //   history.push("/login")
          return;
        }
        axios.get(`${process.env.REACT_APP_API_URL}/users/verifyToken?token=${token}`).then((response) => {
            console.log(response)
        }).catch((error) => {
          removeUserSession();
    
        });
      }, []);

  return (
    <div>
   
    <PageHeader
    className="site-page-header"
    title="Announcements"
  />


    </div>
  );
}

export default Announcement;
