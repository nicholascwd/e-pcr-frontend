import React, { useEffect, useState } from 'react';
import { PageHeader, Switch } from 'antd';
import {
  Typography,
  Table,
  Space,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Alert,
} from 'antd';
import axios from 'axios';
import moment from 'moment-timezone';
import {
  getToken,
  getUser,
  removeUserSession,
  setUserSession,
} from '../../Utils/Common';
import { decryptField } from '../../Utils/EncryptContents';

function ResidentsModuleMainList(props) {
  const { Text, Link } = Typography;
  const [userObject, setUserObject] = useState({ username: null });
  const [patientData, setPatientData] = useState();
  const [dischargedPatientData, setDischargedPatientData] = useState();
  const [readmitBed, setReadmitBed] = useState();
  const [readmitResident, setReadmitResident] = useState();
  const [readmitError, setReadmitError] = useState();

  const token = getToken();
  const user = getUser();

  useEffect(() => {
    if (!token) {
      props.history.push('/login');
      return;
    }
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/verifyToken?token=${token}`)
      .then((response) => {
        setUserObject(user);
      })
      .catch((error) => {
        removeUserSession();
      });

    populateAdmittedResidents();
    populateDischargedResidents();
  }, []);

  function populateAdmittedResidents() {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/residents/listAdmittedFullDetails`,
        {},
        { headers: { token: token } }
      )
      .then((response) => {
        let beds = response.data;

        beds.map((el) => {
          el.name = decryptField(el.name);
          el.NRIC = decryptField(el.NRIC);
          el.numeric = parseInt(el.bed);
        });
        //console.log(response.data)
        function compare(a, b) {
          if (a.numeric < b.numeric) {
            return -1;
          }
          if (a.numeric > b.numeric) {
            return 1;
          }
          return 0;
        }
        beds.sort(compare);

        setPatientData(beds);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function populateDischargedResidents() {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/residents/listDischargedFullDetails`,
        {},
        { headers: { token: token } }
      )
      .then((response) => {
        let beds = response.data;

        beds.map((el) => {
          el.name = decryptField(el.name);
          el.NRIC = decryptField(el.NRIC);
        });
        setDischargedPatientData(beds);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = (e) => {
    setReadmitResident({ uuid: e.uuid, name: e.name });
    setReadmitError(null);
    setIsModalVisible(true);
  };
  const handleReadmitSubmit = () => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/residents/readmit`,
        { uuid: readmitResident.uuid, bed: readmitBed },
        { headers: { token: token } }
      )
      .then((response) => {
        populateAdmittedResidents();
        populateDischargedResidents();

        setIsModalVisible(false);
      })
      .catch((error) => {
        if (error.response.data.error) {
          setReadmitError(error.response.data.error);
        }
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function discharge(uuid) {
    //populate list of admitted residents
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/residents/discharge`,
        { uuid: uuid },
        { headers: { token: token } }
      )
      .then((response) => {
        populateAdmittedResidents();
        populateDischargedResidents();
      })
      .catch((error) => {
        console.log(error.error);
      });
  }

  function handleReadmitNewBed(e) {
    setReadmitBed(e.target.value);
  }
  function handleChangeMonitoringRestraints(e) {
    let monitor;
    if (e.restraintsMonitoring) {
      monitor = false;
      console.log('turn off');
    } else {
      monitor = true;
      console.log('turn on');
    }
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/residents/setRestraintsMonitoringStatus`,
        { uuid: e.uuid, monitor: monitor },
        { headers: { token: token } }
      )
      .then((response) => {
        populateAdmittedResidents();
        populateDischargedResidents();
      })
      .catch((error) => {
        console.log(error.error);
      });
  }

  function handleChangeMonitoringProgress(e) {
    // console.log(e);
    let monitor;
    if (e.progressRecordMonitoring) {
      monitor = false;
      console.log('turn off');
    } else {
      monitor = true;
      console.log('turn on');
    }
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/residents/setProgressRecordMonitoringStatus`,
        { uuid: e.uuid, monitor: monitor },
        { headers: { token: token } }
      )
      .then((response) => {
        populateAdmittedResidents();
        populateDischargedResidents();
      })
      .catch((error) => {
        console.log(error.error);
      });
  }

  const columns = [
    {
      title: 'Name',
      key: '_id',
      dataIndex: 'name',
    },
    {
      title: 'NRIC',
      key: '_id',
      dataIndex: 'NRIC',
    },
    {
      title: 'Bed',
      key: '_id',
      dataIndex: 'bed',
    },
    {
      title: 'Initial admission',
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
              props.history.push('/patient_profile/' + data.bed);
            }}
          >
            View Patient
          </a>
          <Popconfirm
            title="Are you sure to discharge this patient?"
            onConfirm={() => discharge(data.uuid)}
            onCancel={''}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Discharge</a>
          </Popconfirm>
          <Switch
            checked={data.restraintsMonitoring}
            onChange={() => {
              console.log(data.restraintsMonitoring);
              handleChangeMonitoringRestraints(data);
            }}
            checkedChildren="R"
            unCheckedChildren="R"
          />{' '}
          <Switch
            checked={data.progressRecordMonitoring}
            onChange={() => {
              handleChangeMonitoringProgress(data);
            }}
            checkedChildren="P"
            unCheckedChildren="P"
          />
        </Space>
      ),
    },
  ];

  const columnsRestricted = [
    {
      title: 'Name',
      key: '_id',
      dataIndex: 'name',
    },
    {
      title: 'NRIC',
      key: '_id',
      dataIndex: 'NRIC',
    },
    {
      title: 'Bed',
      key: '_id',
      dataIndex: 'bed',
    },
    {
      title: 'Initial admission',
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
              props.history.push('/patient_profile/' + data.bed);
            }}
          >
            View Patient
          </a>
        </Space>
      ),
    },
  ];

  const columnsDischarged = [
    {
      title: 'Name',
      key: '_id',
      dataIndex: 'name',
    },
    {
      title: 'NRIC',
      key: '_id',
      dataIndex: 'NRIC',
    },
    // {
    //   title: 'Bed',
    //   key: '_id',
    //   dataIndex: 'bed',
    // },
    {
      title: 'Initial admission',
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
              props.history.push('/patient_profile/' + data.uuid);
            }}
          >
            View Patient
          </a>

          <Button
            type="secondary"
            onClick={() => {
              showModal(data);
            }}
          >
            Re-admit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader className="site-page-header" title="Residents Module" />
      <div style={{ padding: '30px' }}>
        <Space direction="vertical" size="middle">
          {userObject.role == 'full' && (
            <Button
              onClick={() => {
                props.history.push('/residents_module/admit');
              }}
            >
              Admit New Patient
            </Button>
          )}
          {/* <Text>Input Patient Bed</Text> */}
          <h3>Table of Admitted Patients</h3>
          {userObject.role == 'full' && (
            <Table
              columns={columns}
              dataSource={patientData}
              // onChange={onChange}
            />
          )}
          {userObject.role == 'restricted' && (
            <Table
              columns={columnsRestricted}
              dataSource={patientData}
              // onChange={onChange}
            />
          )}
          <br></br>

          {userObject.role == 'full' && (
            <div>
              <h3>Table of Discharged Patients</h3>

              <Table
                columns={columnsDischarged}
                dataSource={dischargedPatientData}
                // onChange={onChange}
              />
            </div>
          )}
        </Space>

        <Modal
          title="Readmit Resident"
          visible={isModalVisible}
          onOk={handleReadmitSubmit}
          onCancel={handleCancel}
        >
          {readmitResident && <p>{readmitResident.name}</p>}
          <Input
            name="readmitNewBed"
            addonBefore="Bed"
            // onChange={handleReadmitNewBed}
          ></Input>

          {readmitError && <Alert message={readmitError} type="error" />}
        </Modal>
      </div>
    </>
  );
}

export default ResidentsModuleMainList;
