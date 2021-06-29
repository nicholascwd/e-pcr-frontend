import React, { useEffect, useState } from 'react';
import { PageHeader } from 'antd';
import { Typography, Table, Space, Button, Input, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment-timezone';
import { getToken, removeUserSession } from '../../Utils/Common';
import CompletionCards from './CompletionCards';

function CompletionStatusModule(props) {
  const [restraintsPending, setRestraintsPending] = useState();
  const [
    residentsUnderRestraintsMonitoring,
    setResidentsUnderRestraintsMonitoring,
  ] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/completion_status/restraintsForm`,
        { date: datePicker },
        { headers: { token: token } }
      )
      .then((response) => {
        // console.log('restraints status', response.data);
        setRestraintsPending(response.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/residents/getRestraintsMonitoringStatus`,
        {},
        { headers: { token: token } }
      )
      .then((response) => {
        console.log('restraints montor', response.data);
        setResidentsUnderRestraintsMonitoring(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  let listOfResidentsRestraintsMonitoring =
    residentsUnderRestraintsMonitoring?.map((d) => (
      <li key={d['_id']}>{d['bed']}</li>
    ));

  const [datePicker, setDatepicker] = useState(
    moment().add(0, 'days').startOf('day')
  );

  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Completion Status Module"
      />
      <div style={{ padding: '30px' }}>
        <Space direction="vertical" size="middle">
          {/* <Button
            onClick={() => {
              props.history.push('/users_module/addUser');
            }}
          >
            Back
          </Button> */}
          {restraintsPending && (
            <>
              <CompletionCards pendingSubmission={restraintsPending} />
              <br></br>
              <Button type="primary" onClick={showModal}>
                Residents under Restraints Monitoring
              </Button>
              <Modal
                title="Residents under Restraints Monitoring"
                visible={isModalVisible}
                onOk={handleOk}
              >
                {residentsUnderRestraintsMonitoring && (
                  <>{listOfResidentsRestraintsMonitoring}</>
                )}
              </Modal>
            </>
          )}
        </Space>
      </div>
    </>
  );
}

export default CompletionStatusModule;
