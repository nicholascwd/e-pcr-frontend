import React, { useState, useEffect } from 'react';
import { Switch, useHistory } from 'react-router-dom';
import { Layout, Menu, Row, Alert, Col, Avatar } from 'antd';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import './App.css';
import 'antd/dist/antd.css';
import { getToken, getUser, removeUserSession } from './Utils/Common';
import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import Login from './Screens/Login';
import Dashboard from './Screens/Dashboard';
import SelectPatient from './Screens/SelectPatient';
import Announcement from './Screens/Announcement';
import PatientProfile from './Screens/PatientProfile';
import RestraintsForm from './Screens/Forms/RestraintsForm';
import ResidentsModuleMainList from './Screens/ResidentsModule/index';
import AdmitResident from './Screens/ResidentsModule/AdmitPatient';
import ProgressRecordForm from './Screens/Forms/ProgressRecordForm';
import Enroll from './Screens/Enroll';
import UsersModule from './Screens/UsersModule';
import AddUser from './Screens/UsersModule/AddUser';
import ResetPassword from './Screens/UsersModule/PasswordReset';
import CompletionStatusModule from './Screens/CompletionStatus';

function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [userObject, setUserObject] = useState({ username: null });
  const [networkErr, setNetworkErr] = useState(false);
  const { Header, Footer, Sider, Content } = Layout;
  const history = useHistory();
  const user = getUser();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/networkTest`, { timeout: 3000 })
      .then((response) => {
        console.log('IP Whitelisted');
        setNetworkErr(false);
      })
      .catch((error) => {
        setNetworkErr(true);
      });

    const token = getToken();
    if (
      !token &&
      window.location.pathname !== '/login' &&
      window.location.pathname !== '/enroll'
    ) {
      window.open('/login', '_self');
      return;
    }
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/users/verifyToken?token=${token}`,
        { timeout: 4000 }
      )
      .then((response) => {
        setAuthLoading(false);
        setUserObject(user);
      })
      .catch((error) => {
        removeUserSession();
        setAuthLoading(false);
      });
  }, []);

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>;
  }

  return (
    <div className="App">
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="header">
          <div className="logo" />
          <Row justify="end">
            {userObject.username != null && (
              <>
                <Col span={1}>
                  {<Avatar size={40}>{userObject.username}</Avatar>}
                </Col>
                <Col span={1}></Col>
              </>
            )}
          </Row>
        </Header>
        <Layout>
          {window.location.pathname !== '/login' ? (
            <>
              <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                  console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                  console.log(collapsed, type);
                }}
              >
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                  <Menu.Item
                    key="1"
                    icon={<FileTextOutlined />}
                    onClick={() => history.push('/select_patient')}
                  >
                    Forms
                  </Menu.Item>
                  <Menu.Item
                    key="2"
                    icon={<SettingOutlined />}
                    onClick={() => history.push('/residents_module')}
                  >
                    Residents Module
                  </Menu.Item>
                  {userObject.role === 'full' && (
                    <Menu.Item
                      key="3"
                      icon={<SettingOutlined />}
                      onClick={() => history.push('/users_module')}
                    >
                      Users Module
                    </Menu.Item>
                  )}
                  <Menu.Item
                    key="4"
                    icon={<BellOutlined />}
                    onClick={() => history.push('/announcement')}
                  >
                    Announcements
                  </Menu.Item>
                  <Menu.Item
                    key="5"
                    icon={<BellOutlined />}
                    onClick={() => history.push('/settings')}
                  >
                    Settings
                  </Menu.Item>
                  <Menu.Item
                    key="6"
                    icon={<BellOutlined />}
                    onClick={() => history.push('/completion_status')}
                  >
                    Completion Status
                  </Menu.Item>
                </Menu>
              </Sider>
            </>
          ) : (
            <></>
          )}
          <Layout>
            {networkErr ? (
              <Alert
                message="Network Error"
                description="Please connect to TLR Wifi"
                type="error"
                showIcon
                style={{ textAlign: 'left' }}
              />
            ) : (
              <></>
            )}
            <Content>
              <div className="content">
                <Switch>
                  <PublicRoute path="/login" component={Login} />
                  <PublicRoute path="/enroll" component={Enroll} />
                  <PrivateRoute path="/settings" component={Dashboard} />
                  <PrivateRoute path="/announcement" component={Announcement} />
                  <PrivateRoute
                    exact
                    path={['/select_patient', '/']}
                    component={SelectPatient}
                  />
                  <PrivateRoute
                    exact
                    path={['/patient_profile/:bedNo', '/']}
                    component={PatientProfile}
                  />
                  <PrivateRoute
                    exact
                    path={['/forms/restraints_form/:uuid', '/']}
                    component={RestraintsForm}
                  />
                  <PrivateRoute
                    exact
                    path={['/forms/progress_record_form/:uuid', '/']}
                    component={ProgressRecordForm}
                  />
                  <PrivateRoute
                    exact
                    path={['/residents_module/', '/']}
                    component={ResidentsModuleMainList}
                  />
                  <PrivateRoute
                    exact
                    path={['/residents_module/admit', '/']}
                    component={AdmitResident}
                  />
                  <PrivateRoute
                    exact
                    path={['/users_module', '/']}
                    component={UsersModule}
                  />
                  <PrivateRoute
                    exact
                    path={['/users_module/addUser', '/']}
                    component={AddUser}
                  />
                  <PrivateRoute
                    exact
                    path={['/users_module/reset_password/:username', '/']}
                    component={ResetPassword}
                  />
                  <PrivateRoute
                    exact
                    path={['/completion_status', '/']}
                    component={CompletionStatusModule}
                  />
                </Switch>
              </div>
            </Content>
            <Footer>ePCR</Footer>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
