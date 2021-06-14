import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, Table, Tag, Space, Input, Alert,
} from 'antd';
import { UserOutlined, KeyOutlined, HomeOutlined } from '@ant-design/icons';
import {
    getToken, getUser, removeUserSession, setUserSession,
  } from '../Utils/Common';

function Enroll(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);


  useEffect(() => {


    
    const token = getToken();
    if (!token && (window.location.pathname!=='/login') && (window.location.pathname!=='/enroll')) {
      // history.push("/login")
      window.open('/login','_self')
      //console.log(window.location.pathname)
      return;
    }

    axios.get("https://go.lentorresidence.com/KEY6DS89AD8GB5S4F4GB6NH78SD7F5B4F").then((response) => {
      console.log(response.data)

    }).catch((error) => {
        console.log(error)
    });
  }, []);


  // handle button click of login form
  const handleEnroll = () => {
    setError(null);
    setLoading(true);
    axios.get("https://go.lentorresidence.com/"+username.value, {timeout: 1000}).then((response) => {
        console.log(response.data)
        localStorage.setItem('SignedSymmmetricKey',response.data)
        window.open('/login','_self')
    //   setLoading(false);
    //   setUserSession(response.data.token, response.data.user);
    //   window.open('/login','_self');
    }).catch((error) => {
      setLoading(false);
      if (error.reponse && error.response.status === 401) setError(error.response.data.message);
      else setError('Enrollment Key Invalid. Please try again.');
    });
  };

  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    }}>
      <Space direction="vertical" size="middle" style={{ width: '400px' }}>
        {
          error
            ? <Alert
                message="Login Failed"
                description={error}
                type="error"
                showIcon
                style={{ textAlign: 'left' }}
                />
            : <></>
        }
        <h4>Enrollment Secret</h4>
        <p>Contact admin to assist with keying in enrollment secret</p>
        <Input {...username} size="large" placeholder="Enrollment Secret" type="password" prefix={<UserOutlined />} />
        <Button type="primary" size="large" shape="round" onClick={handleEnroll} loading={loading} style={{ width: '100%' }} >
          {loading ? 'Logging In...' : 'Login'}
        </Button>
      </Space>
    </div>
  );
}

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};

export default Enroll;
