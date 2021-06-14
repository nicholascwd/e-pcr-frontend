import React, { useState } from 'react';
import axios from 'axios';
import {
  Button, Table, Tag, Space, Input, Alert,
} from 'antd';
import { UserOutlined, KeyOutlined, HomeOutlined } from '@ant-design/icons';
import { setAESKeyInSession, setUserSession } from '../Utils/Common';
import { useEffect } from 'react';

function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);


  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    axios.post(`${process.env.REACT_APP_API_URL}/users/signin`, {
      username: username.value,
      password: password.value,
    }).then((response) => {
      setLoading(false);
      setUserSession(response.data.token, response.data.user);
      setAESKeyInSession(response.data.key)
      window.open('/select_patient','_self');
    }).catch((error) => {
      setLoading(false);
      if (error.reponse && error.response.status === 401) setError(error.response.data.message);
      else setError('Something went wrong. Please try again later.');
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
        <Input {...username} size="large" placeholder="Username" prefix={<UserOutlined />} />
        <Input.Password {...password} size="large" placeholder="Password" prefix={<KeyOutlined />} />
        <Button type="primary" size="large" shape="round" onClick={handleLogin} loading={loading} style={{ width: '100%' }} >
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

export default Login;
