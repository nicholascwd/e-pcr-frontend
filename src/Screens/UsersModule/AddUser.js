import React, { useEffect, useState } from 'react';
import { PageHeader, Form, Select } from 'antd';
import { Typography, Table, Space, Button, Input, Result, Alert } from 'antd';
import axios from 'axios';
import moment from 'moment-timezone';
import {
  getToken,
  getUser,
  removeUserSession,
  setUserSession,
} from '../../Utils/Common';
import { encryptField } from '../../Utils/EncryptContents';

function AddUser(props) {
  const token = getToken();

  const { Text, Link } = Typography;
  const [submitted, setSubmitted] = useState(false);
  const [admitError, setAdmitError] = useState();
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
    const token = getToken();
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
    props.history.push('/users_module');
  }

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    //submit restraints form
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/users/register`,
        {
          username: values.username.toUpperCase(),
          password: values.password,
          email: values.email,
          role: values.role,
        },
        { headers: { token: token } }
      )
      .then((response) => {
        setSubmitted(true);
        setAdmitError(null);
        //console.log(response.data[0])
      })
      .catch((error) => {
        console.log(error.response.data.message);
        setAdmitError(error.response.data.message);
        //   setPatientError(error.response.data.error)
      });
  };

  return (
    <>
      <Button style={{ margin: '10px' }} onClick={handleBack} type="default">
        Back
      </Button>
      <PageHeader className="site-page-header" title="Add Staff User" />
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
                <Form.Item name="username" label="Username" required>
                  <Input required />
                </Form.Item>
                <Form.Item name="password" label="Password" required>
                  <Input required />
                </Form.Item>
                <Form.Item name="email" label="Email Address" required>
                  <Input required />
                </Form.Item>
                <Form.Item
                  name="role"
                  label="role"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select placeholder="Select User Role" allowClear>
                    <Option value="restricted">Restricted (Staff)</Option>
                    <Option value="full">Full (Admin)</Option>
                  </Select>
                </Form.Item>

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
              subTitle="Staff Account Created"
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

export default AddUser;
