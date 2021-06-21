import React from 'react';
import { getUser, removeUserSession } from '../Utils/Common';
import { Button, PageHeader } from 'antd';
function Dashboard(props) {
  const user = getUser();

  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    window.open('/login', '_self');
  };

  return (
    <>
      <PageHeader className="site-page-header" title="Settings" />
      <div style={{ padding: '30px' }}>
        <Button
          type="primary"
          onClick={() => {
            handleLogout();
          }}
          key="console"
        >
          Logout
        </Button>
        <br></br>
        <br></br>
        <Button
          type="primary"
          onClick={() => {
            props.history.push('/users_module/reset_password/' + user.username);
          }}
          key="console"
        >
          Change Password
        </Button>
      </div>
    </>
  );
}

export default Dashboard;
