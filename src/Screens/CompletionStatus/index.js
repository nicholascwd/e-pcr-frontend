import React, { useEffect, useState } from 'react';
import { PageHeader } from 'antd';
import { Typography, Table, Space, Button, Input, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment-timezone';
import { getToken, removeUserSession } from '../../Utils/Common';
import RestraintsCompletionCards from './RestraintsCompletionCards';
import ProgressCompletionCards from './ProgressCompletionCards';

function CompletionStatusModule(props) {
  const [restraintsPending, setRestraintsPending] = useState();
  const [
    residentsUnderRestraintsMonitoring,
    setResidentsUnderRestraintsMonitoring,
  ] = useState();
  const [progressPending, setProgressPending] = useState();
  const [
    residentsUnderProgressMonitoring,
    setResidentsUnderProgressMonitoring,
  ] = useState();
  const [isRModalVisible, setIsRModalVisible] = useState(false);
  const [isPModalVisible, setIsPModalVisible] = useState(false);
  const showRModal = () => {
    setIsRModalVisible(true);
  };
  const showPModal = () => {
    setIsPModalVisible(true);
  };
  const handleOk = () => {
    setIsPModalVisible(false);
    setIsRModalVisible(false);
  };

  const handleCancel = () => {
    setIsPModalVisible(false);
    setIsRModalVisible(false);
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
        `${process.env.REACT_APP_API_URL}/completion_status/progressForm`,
        { date: datePicker },
        { headers: { token: token } }
      )
      .then((response) => {
        // console.log('restraints status', response.data);
        setProgressPending(response.data);
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

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/residents/getProgressMonitoringStatus`,
        {},
        { headers: { token: token } }
      )
      .then((response) => {
        console.log('restraints montor', response.data);
        setResidentsUnderProgressMonitoring(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let listOfResidentsRestraintsMonitoring =
    residentsUnderRestraintsMonitoring?.map((d) => (
      <li key={d['_id']}>{d['bed']}</li>
    ));

  let listOfResidentsProgressMonitoring = residentsUnderProgressMonitoring?.map(
    (d) => <li key={d['_id']}>{d['bed']}</li>
  );

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
          {restraintsPending && (
            <>
              <RestraintsCompletionCards
                pendingSubmission={restraintsPending}
              />
              <br></br>
              <Button type="primary" onClick={showRModal}>
                Residents under Restraints Monitoring
              </Button>
              <Modal
                title="Residents under Restraints Monitoring"
                visible={isRModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                {residentsUnderRestraintsMonitoring && (
                  <>{listOfResidentsRestraintsMonitoring}</>
                )}
              </Modal>
            </>
          )}

          {progressPending && (
            <>
              <ProgressCompletionCards pendingSubmission={progressPending} />
              <br></br>
              <Button type="primary" onClick={showPModal}>
                Residents under Progress Monitoring
              </Button>
              <Modal
                title="Residents under Progress Monitoring"
                visible={isPModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                {residentsUnderProgressMonitoring && (
                  <>{listOfResidentsProgressMonitoring}</>
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
