import React, { useEffect, useState } from 'react';
import { PageHeader, Form, Select } from 'antd';
import { Space, Button, Input, Result, Alert } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router';
var owasp = require('owasp-password-strength-test');
import { getToken, removeUserSession } from '../../Utils/Common';

owasp.config({
  allowPassphrases: false,
  maxLength: 128,
  minLength: 10,
  minPhraseLength: 20,
  minOptionalTestsToPass: 7,
});

function ResetPassword(props) {
  const token = getToken();
  const { username } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [admitError, setAdmitError] = useState();
  const [passwordSecurity, setPasswordSecurity] = useState();

  const useFormInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    const handleChange = (e) => {
      setValue(e.target.value);
      let result = owasp.test(e.target.value);
      setPasswordSecurity(result.requiredTestErrors);
    };
    return {
      value,
      onChange: handleChange,
    };
  };
  const password = useFormInput('');
  const formItemLayout = {
    labelCol: {
      span: 30,
      offset: 0,
    },
    wrapperCol: {
      span: 50,
    },
  };

  useEffect(() => {
    if (!token) {
      props.history.push('/login');
      return;
    }
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/verifyToken?token=${token}`)
      .then((response) => {})
      .catch((error) => {
        removeUserSession();
      });
  }, []);

  function handleBack() {
    props.history.push('/');
  }

  const onFinish = (values) => {
    if (passwordSecurity.length !== 0) {
      alert('Password complexity requirements not met');
      return;
    }

    //submit password reset
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/users/resetPassword`,
        {
          username: username,
          password: values.password,
        },
        { headers: { token: token } }
      )
      .then((response) => {
        setSubmitted(true);
        setAdmitError(null);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        setAdmitError(error.response.data.message);
      });
  };

  return (
    <>
      <Button style={{ margin: '10px' }} onClick={handleBack} type="default">
        Back
      </Button>
      <PageHeader className="site-page-header" title="Reset Password" />
      <div style={{ padding: '30px' }}>
        <Space direction="vertical" size="middle">
          {admitError && (
            <>
              <Alert
                message="Error"
                description={admitError}
                type="error"
                showIcon
              />
            </>
          )}

          {!submitted && (
            <div>
              <Form
                name="validate_other"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Form.Item name="password" label="Password" required>
                  <Input {...password} type="password" required />
                </Form.Item>
                <p>{passwordSecurity}</p>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}

          {submitted && (
            <Result
              status="success"
              title="Success!"
              subTitle="Password reset successful"
              extra={[
                <Button type="primary" onClick={handleBack} key="console">
                  Back
                </Button>,
              ]}
            />
          )}
        </Space>
      </div>
    </>
  );
}

export default ResetPassword;
