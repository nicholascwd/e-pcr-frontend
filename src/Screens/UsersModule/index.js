import React, { useEffect, useState } from 'react';
import { PageHeader } from 'antd';
import { Typography, Table, Space, Button, Input } from 'antd';
import axios from 'axios';
import moment from 'moment-timezone';
import {
  getToken,
  getUser,
  removeUserSession,
  setUserSession,
} from '../../Utils/Common';
import { decryptField } from '../../Utils/EncryptContents';

function UsersModule(props) {
  const { Text, Link } = Typography;
  const [userData, setUserData] = useState();

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

    //populate list of admitted residents
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/users/listStaff`,
        {},
        { headers: { token: token } }
      )
      .then((response) => {
        console.log(response);
        //console.log(response.data)
        setUserData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function onChange(sorter) {
    console.log('params', sorter);
  }

  const columns = [
    {
      title: 'Username',
      key: '_id',
      dataIndex: 'username',
    },
    {
      title: 'Email',
      key: '_id',
      dataIndex: 'email',
    },
    {
      title: 'Role',
      key: '_id',
      dataIndex: 'role',
    },
    {
      title: 'Date Created',
      key: '_id',
      dataIndex: 'creationDate',
      render: (text) => <p>{moment(text).format('MMMM Do YYYY, h:mm:ss a')}</p>,
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (data) => (
        <Space size="middle">
          <a
            onClick={() => {
              props.history.push('');
            }}
          >
            Reset Password
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader className="site-page-header" title="User Management Module" />
      <div style={{ padding: '30px' }}>
        <Space direction="vertical" size="middle">
          <Button
            onClick={() => {
              props.history.push('/users_module/addUser');
            }}
          >
            Add new Staff
          </Button>
          {/* <Text>Input Patient Bed</Text> */}
          <h3>Registed Staff List</h3>
          <Table columns={columns} dataSource={userData} onChange={onChange} />
        </Space>
      </div>
    </>
  );
}

export default UsersModule;
