import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  NavLink,
  useHistory,
  useParams,
} from "react-router-dom";
import { Layout, Menu, Button, Row, Alert, Col, Avatar } from "antd";
import {
  BarChartOutlined,
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
} from "@ant-design/icons";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";
import {
  getToken,
  getUser,
  removeUserSession,
  setUserSession,
} from "./Utils/Common";
import PrivateRoute from "./Utils/PrivateRoute";
import PublicRoute from "./Utils/PublicRoute";
import Login from "./Screens/Login";
import Dashboard from "./Screens/Dashboard";
import SelectPatient from "./Screens/SelectPatient";
import Announcement from "./Screens/Announcement";
import PatientProfile from "./Screens/PatientProfile";
import RestraintsForm from "./Screens/Forms/RestraintsForm";
import ResidentsModuleMainList from "./Screens/ResidentsModule/MainList";
import AdmitResident from "./Screens/ResidentsModule/AdmitPatient";
import ProgressRecordForm from "./Screens/Forms/ProgressRecordForm";
import Enroll from "./Screens/Enroll";

function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [userObject, setUserObject] = useState({ username: null });
  const [sideMenuCollasped, setSideMenuCollasped] = useState(false);
  const [networkErr, setNetworkErr] = useState(false);
  const { Header, Footer, Sider, Content } = Layout;
  const history = useHistory();
  const user = getUser();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/networkTest`, { timeout: 3000 })
      .then((response) => {
        console.log("IP Whitelisted");
        setNetworkErr(false);
      })
      .catch((error) => {
        setNetworkErr(true);
      });

    const token = getToken();
    if (
      !token &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/enroll"
    ) {
      // history.push("/login")
      window.open("/login", "_self");
      //console.log(window.location.pathname)
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
  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    window.open("/login", "_self");
  };

  const onSideMenuCollapse = (collapsed) => {
    setSideMenuCollasped(collapsed);
  };

  return (
    <div className="App">
      <Layout style={{ minHeight: "100vh" }}>
        <Header className="header">
          <div className="logo" />
          <Row justify="end">
            {userObject.username != null && (
              <>
                <Col span={1}>
                  {<Avatar size={40}>{userObject.username}</Avatar>}
                </Col>
                <Col span={1}>
                  {/* {<Button onClick={handleLogout()}>Log Out</Button>} */}
                </Col>
              </>
            )}
          </Row>
        </Header>
        <Layout>
          {window.location.pathname !== "/login" ? (
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
                <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
                  <Menu.Item
                    key="1"
                    icon={<FileTextOutlined />}
                    onClick={() => history.push("/select_patient")}
                  >
                    Forms
                  </Menu.Item>
                  <Menu.Item
                    key="2"
                    icon={<SettingOutlined />}
                    onClick={() => history.push("/residents_module")}
                  >
                    Residents Module
                  </Menu.Item>
                  <Menu.Item
                    key="3"
                    icon={<BellOutlined />}
                    onClick={() => history.push("/announcement")}
                  >
                    Announcements
                  </Menu.Item>
                  <Menu.Item
                    key="4"
                    icon={<BellOutlined />}
                    onClick={() => history.push("/settings")}
                  >
                    Settings
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
                style={{ textAlign: "left" }}
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
                    path={["/select_patient", "/"]}
                    component={SelectPatient}
                  />
                  <PrivateRoute
                    exact
                    path={["/patient_profile/:bedNo", "/"]}
                    component={PatientProfile}
                  />
                  <PrivateRoute
                    exact
                    path={["/forms/restraints_form/:uuid", "/"]}
                    component={RestraintsForm}
                  />
                  <PrivateRoute
                    exact
                    path={["/forms/progress_record_form/:uuid", "/"]}
                    component={ProgressRecordForm}
                  />
                  <PrivateRoute
                    exact
                    path={["/residents_module/", "/"]}
                    component={ResidentsModuleMainList}
                  />
                  <PrivateRoute
                    exact
                    path={["/residents_module/admit", "/"]}
                    component={AdmitResident}
                  />
                </Switch>
              </div>
            </Content>
            <Footer>ePCR Demo</Footer>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
