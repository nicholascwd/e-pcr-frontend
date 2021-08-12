import React, { useEffect, useReducer, useState } from 'react';
import {
  PageHeader,
  Space,
  Button,
  DatePicker,
  Switch,
  Modal,
  Input,
} from 'antd';
import RCTable from 'rc-table';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import moment from 'moment-timezone';

import { getToken, getUser, removeUserSession } from '../Utils/Common';
import { useParams } from 'react-router';
import {
  encryptField,
  decryptObject,
  decryptField,
} from '../Utils/EncryptContents';
import { restraintsPdfExport } from './PDFExport/RestraintsExport';
// import { restraintsColumns } from './FormColumns/RestraintsTable';
// import { progressRecordColumns } from './FormColumns/ProgressRecordTable';
import { progressRecordPdfExport } from './PDFExport/ProgressRecordExport';
import ChangeRequestModal from './Forms/ChangeRequestModal';
import PatientCard from './ResidentsModule/PatientCard';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import '../Assets/index.less';

function PatientProfile(props) {
  const [patientData, setPatientData] = useState();
  const [patientError, setPatientError] = useState();
  const [userRole, setUserRole] = useState({ role: null });
  const [restraintsSubmissions, setRestraintsSubmissions] = useState();
  const [restraintsDatePicker, setRestraintsDatePicker] = useState([
    moment().add(-2, 'days').startOf('day'),
    moment().endOf('day'),
  ]);
  const [progressRecordSubmissions, setProgressRecordSubmissions] = useState();
  const [changeRequestRow, setChangeRequestRow] = useState();
  const [changeRequestType, setChangeRequestType] = useState();
  const [showChangeRequest, setShowChangeRequest] = useState(true);
  const [changeRequestComment, setChangeRequestComment] = useState(true);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = (e, type) => {
    // setReadmitResident({ uuid: e.uuid, name: e.name });
    // setReadmitError(null);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const { RangePicker } = DatePicker;
  const user = getUser();

  let { bedNo } = useParams();
  const token = getToken();
  useEffect(() => {
    if (!token) {
      props.history.push('/login');
      return;
    }
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/verifyToken?token=${token}`)
      .then((response) => {
        //for debug
        setUserRole(user.role);
        // console.log('role, ', user.role);
      })
      .catch((error) => {
        removeUserSession();
      });
    //obtain resident details based on bed from url params
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/residents/getByBed`,
        { bed: bedNo },
        { headers: { token: token } }
      )
      .then((response) => {
        setPatientData(response.data[0]);
      })
      .catch((error) => {
        console.log(error);
        // setPatientError(error.response.data.error);
      });
  }, []);

  function compareTime(a, b) {
    if (a.timeslot < b.timeslot) {
      return 1;
    }
    if (a.timeslot > b.timeslot) {
      return -1;
    }
    return 0;
  }
  function compareDate(a, b) {
    if (a.dateTime < b.dateTime) {
      return 1;
    }
    if (a.dateTime > b.dateTime) {
      return -1;
    }
    return 0;
  }

  let changeRequest = (data) => {
    // console.log(data);
  };

  useEffect(() => {
    //obtain resident restraint's form submission history

    if (patientData) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/forms/restraintsForm/submissionHistory`,
          {
            uuid: patientData.uuid,
            restraintsDatePicker: restraintsDatePicker,
          },
          { headers: { token: token } }
        )
        .then((response) => {
          let formDataPros = response.data;
          formDataPros.map((el) => {
            el.formVals = decryptObject(el.formData);
            el.timeslot = parseInt(el.timeslot);
          });

          formDataPros.sort(compareTime);
          formDataPros.sort(compareDate);

          setRestraintsSubmissions(formDataPros);
          // console.log('FDR', formDataPros);
        })
        .catch((error) => {
          console.log(error);
        });

      axios
        .post(
          `${process.env.REACT_APP_API_URL}/forms/progressRecordForm/submissionHistory`,
          {
            uuid: patientData.uuid,
            restraintsDatePicker: restraintsDatePicker,
          },
          { headers: { token: token } }
        )
        .then((response) => {
          let formDataPros2 = response.data;
          formDataPros2.map((el) => {
            el.formVals = decryptObject(el.formData);
          });

          var preferredOrder = ['ND', 'AM', 'PM'];

          formDataPros2.sort(function (a, b) {
            return (
              preferredOrder.indexOf(b.timeslot) -
              preferredOrder.indexOf(a.timeslot)
            );
          });
          formDataPros2.sort(compareDate);
          setProgressRecordSubmissions(formDataPros2);
          // console.log('prog', formDataPros2);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [patientData, restraintsDatePicker, isModalVisible]);

  function handleClickRestraints() {
    props.history.push(`/forms/restraints_form/${patientData.uuid}`);
  }

  function handleClickProgressRecord() {
    props.history.push(`/forms/progress_record_form/${patientData.uuid}`);
  }

  function handleBack() {
    props.history.push('/select_patient');
  }
  function generateRestraintsPDF() {
    restraintsPdfExport(patientData, restraintsSubmissions);
  }
  function generateProgressRecordPDF() {
    progressRecordPdfExport(patientData, progressRecordSubmissions);
  }
  function restraintsStatusChange(checked) {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/residents/setRestraintsMonitoringStatus`,
        {
          uuid: patientData.uuid,
          monitor: checked,
        },
        { headers: { token: token } }
      )
      .catch((error) => {
        console.log(error);
      });
  }
  function progressRecordStatusChange(checked) {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/residents/setProgressRecordMonitoringStatus`,
        {
          uuid: patientData.uuid,
          monitor: checked,
        },
        { headers: { token: token } }
      )
      .catch((error) => {
        console.log(error);
      });
  }

  function handleChangeRequestComment(e) {
    setChangeRequestComment(e.target.value);
    // console.log(e.target.value);
  }

  function handleChangeRequestSubmit() {
    let formType;
    if (changeRequestRow.type == 'restraints') {
      formType = 'restraintsForm';
    } else if ((changeRequestRow.type = 'progress')) {
      formType = 'progressRecordForm';
    }
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/forms/${formType}/changeRequest`,
        {
          _id: changeRequestRow.row,
          changeRequestComment: encryptField(changeRequestComment),
        },
        { headers: { token: token } }
      )
      .then(() => {
        setIsModalVisible(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //
  const restraintsColumns = [
    {
      text: 'Date',
      key: '_id',
      dataField: 'formVals',
      // fixed: "left",
      // width: 100,
      formatter: (text) => <p>{JSON.parse(text).date}</p>,
    },
    {
      text: 'Time',
      key: '_id',
      dataField: 'formVals',
      // width: 50,
      formatter: (text) => <p>{JSON.parse(text).time}</p>,
    },
    {
      text: 'Restraints Applied Correctly',
      key: '_id',
      dataField: 'formVals',
      // width: 50,
      formatter: (text) => <p>{JSON.parse(text).r1}</p>,
    },
    {
      text: 'Body & Limbs Comfortable',
      key: '_id',
      dataField: 'formVals',
      // width: 50,
      formatter: (text) => <p>{JSON.parse(text).r2}</p>,
    },

    {
      text: 'Adequate Circulation (Restrained Limbs)',
      key: '_id',
      dataField: 'formVals',
      // width: 50,
      formatter: (text) => <p>{JSON.parse(text).r3}</p>,
    },
    {
      text: 'Adequate ROM (Restrained Limbs)',
      key: '_id',
      dataField: 'formVals',
      // width: 50,
      formatter: (text) => <p>{JSON.parse(text).r4}</p>,
    },

    {
      text: 'Skin Integrity Checked',
      key: '_id',
      dataField: 'formVals',
      // width: 50,
      formatter: (text) => <p>{JSON.parse(text).r5}</p>,
    },
    {
      text: 'Type of Restraints',
      key: '_id',
      dataField: 'formVals',
      // width: 50,
      formatter: (text) => <p>{JSON.parse(text)['r-restraints-type']}</p>,
    },
    {
      text: 'Remarks',
      key: '_id',
      dataField: 'formVals',
      // width: 50,
      formatter: (text) => <p>{JSON.parse(text)['r-remarks']}</p>,
    },
    {
      text: 'Staff',
      key: '_id',
      dataField: 'staff',
      // width: 50,
    },
    {
      text: 'Submitted D/T',
      key: '_id',
      dataField: 'creationDate',
      // width: 50,
      formatter: (text) => (
        <p>{moment(text).format('MMMM Do YYYY, h:mm:ss a')}</p>
      ),
      // fixed: "right",
      // width: 100,
    },
    {
      text: 'Changes',
      key: '_id',
      dataField: 'changeRequest',
      // width: 50,
      formatter: (text) => {
        let changeRequestString = '';
        let i = 1;
        text.map((data) => {
          // console.log(data);
          changeRequestString =
            changeRequestString +
            `[${i}. ${data?.metadata} COMMENT: ${decryptField(
              data?.comment
            )}] `;
          i++;
        });
        console.log('new crs', changeRequestString);
        {
          return changeRequestString;
        }
      },

      // fixed: "right",
      // width: 100,
    },
    {
      text: 'Action',
      dataField: '_id',
      // width: 50,
      formatter: (data) => (
        <>
          <Button
            onClick={() => {
              setChangeRequestRow({ type: 'restraints', row: data });
              // console.log('add CR, ', data);
              showModal(data, 'restraints');
            }}
          >
            Add Remark
          </Button>
        </>
      ),
      // fixed: "right",
      // width: 100,
    },
  ];

  const restraintsColumnsRestricted = [
    {
      text: 'Date',
      key: '_id',
      dataField: 'formVals',
      // fixed: "left",
      // width: 100,
      formatter: (text) => <p>{JSON.parse(text).date}</p>,
    },
    {
      text: 'Time',
      key: '_id',
      dataField: 'formVals',
      // width: 50,
      formatter: (text) => <p>{JSON.parse(text).time}</p>,
    },
    {
      text: 'Restraints Applied Correctly',
      key: '_id',
      dataField: 'formVals',
      // width: 50,
      formatter: (text) => <p>{JSON.parse(text).r1}</p>,
    },
    {
      text: 'Body & Limbs Comfortable',
      key: '_id',
      dataField: 'formVals',
      // width: 50,
      formatter: (text) => <p>{JSON.parse(text).r2}</p>,
    },

    {
      text: 'Adequate Circulation (Restrained Limbs)',
      key: '_id',
      dataField: 'formVals',
      // width: 50,
      formatter: (text) => <p>{JSON.parse(text).r3}</p>,
    },
    {
      text: 'Adequate ROM (Restrained Limbs)',
      key: '_id',
      dataField: 'formVals',
      // width: 50,
      formatter: (text) => <p>{JSON.parse(text).r4}</p>,
    },

    {
      text: 'Skin Integrity Checked',
      key: '_id',
      dataField: 'formVals',
      // width: 50,
      formatter: (text) => <p>{JSON.parse(text).r5}</p>,
    },
    {
      text: 'Type of Restraints',
      key: '_id',
      dataField: 'formVals',
      // width: 50,
      formatter: (text) => <p>{JSON.parse(text)['r-restraints-type']}</p>,
    },
    {
      text: 'Remarks',
      key: '_id',
      dataField: 'formVals',
      // width: 50,
      formatter: (text) => <p>{JSON.parse(text)['r-remarks']}</p>,
    },
    {
      text: 'Staff',
      key: '_id',
      dataField: 'staff',
      // width: 50,
    },
    {
      text: 'Submitted D/T',
      key: '_id',
      dataField: 'creationDate',
      // width: 50,
      formatter: (text) => (
        <p>{moment(text).format('MMMM Do YYYY, h:mm:ss a')}</p>
      ),
      // fixed: "right",
      // width: 100,
    },
    {
      text: 'Changes',
      key: '_id',
      dataField: 'changeRequest',
      // width: 50,
      formatter: (text) => {
        let changeRequestString = '';
        let i = 1;
        text.map((data) => {
          // console.log(data);
          changeRequestString =
            changeRequestString +
            `${i}. ${data?.metadata} COMMENT: ${decryptField(data?.comment)}; `;
          i++;
        });
        // console.log('new crs', changeRequestString);
        {
          return changeRequestString;
        }
      },

      // fixed: "right",
      // width: 100,
    },
  ];

  const progressRecordColumns = [
    {
      text: 'Date',
      key: '_id',
      dataField: 'formVals',
      // fixed: 'left',
      // width: 100,
      formatter: (text) => <p>{JSON.parse(text).date}</p>,
    },
    {
      text: 'Time',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).time}</p>,
    },
    {
      text: 'General Condition',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p1}</p>,
    },
    {
      text: 'Mental State',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p2}</p>,
    },
    {
      text: 'Skin Care',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p3}</p>,
    },
    {
      text: 'Hygiene/ Bathing',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p4}</p>,
    },
    {
      text: 'Oral Care',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p5}</p>,
    },
    {
      text: 'Feeding',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p6}</p>,
    },
    {
      text: 'Bladder',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p7}</p>,
    },
    {
      text: 'Bowel',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p8}</p>,
    },
    {
      text: 'Mobility',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p9}</p>,
    },
    {
      text: 'Rest at Night',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p10}</p>,
    },
    {
      text: 'Therapy',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p11}</p>,
    },
    {
      text: 'Visited',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p12}</p>,
    },
    {
      text: 'Remarks',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text)['r-remarks']}</p>,
    },
    {
      text: 'Staff',
      key: '_id',
      dataField: 'staff',
    },
    {
      text: 'Submitted D/T',
      key: '_id',
      dataField: 'creationDate',
      formatter: (text) => (
        <p>{moment(text).format('MMMM Do YYYY, h:mm:ss a')}</p>
      ),
      // fixed: 'right',
      // width: 100,
    },
    {
      text: 'Changes',
      key: '_id',
      dataField: 'changeRequest',
      // width: 50,
      formatter: (text) => {
        let changeRequestString = '';
        let i = 1;
        if (text) {
          text.map((data) => {
            // console.log(data);
            changeRequestString =
              changeRequestString +
              `${i}. ${data?.metadata} COMMENT: ${decryptField(
                data?.comment
              )}; `;
            i++;
          });
        }

        // console.log('new crs', changeRequestString);
        {
          return changeRequestString;
        }
      },

      // fixed: "right",
      // width: 100,
    },
    {
      text: 'Action',
      dataField: '_id',
      // width: 50,
      formatter: (data) => (
        <>
          <Button
            onClick={() => {
              setChangeRequestRow({ type: 'progress', row: data });
              // console.log('add CR, ', data);
              showModal(data, 'progress');
            }}
          >
            Add Remark
          </Button>
        </>
      ),
      // fixed: "right",
      // width: 100,
    },
  ];

  const progressRecordColumnsRestricted = [
    {
      text: 'Date',
      key: '_id',
      dataField: 'formVals',
      // fixed: 'left',
      // width: 100,
      formatter: (text) => <p>{JSON.parse(text).date}</p>,
    },
    {
      text: 'Time',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).time}</p>,
    },
    {
      text: 'General Condition',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p1}</p>,
    },
    {
      text: 'Mental State',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p2}</p>,
    },
    {
      text: 'Skin Care',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p3}</p>,
    },
    {
      text: 'Hygiene/ Bathing',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p4}</p>,
    },
    {
      text: 'Oral Care',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p5}</p>,
    },
    {
      text: 'Feeding',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p6}</p>,
    },
    {
      text: 'Bladder',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p7}</p>,
    },
    {
      text: 'Bowel',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p8}</p>,
    },
    {
      text: 'Mobility',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p9}</p>,
    },
    {
      text: 'Rest at Night',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p10}</p>,
    },
    {
      text: 'Therapy',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p11}</p>,
    },
    {
      text: 'Visited',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text).p12}</p>,
    },
    {
      text: 'Remarks',
      key: '_id',
      dataField: 'formVals',
      formatter: (text) => <p>{JSON.parse(text)['r-remarks']}</p>,
    },
    {
      text: 'Staff',
      key: '_id',
      dataField: 'staff',
    },
    {
      text: 'Submitted D/T',
      key: '_id',
      dataField: 'creationDate',
      formatter: (text) => (
        <p>{moment(text).format('MMMM Do YYYY, h:mm:ss a')}</p>
      ),
      // fixed: 'right',
      // width: 100,
    },
    {
      text: 'Changes',
      key: '_id',
      dataField: 'changeRequest',
      // width: 50,
      formatter: (text) => {
        let changeRequestString = '';
        let i = 1;
        if (text) {
          text.map((data) => {
            changeRequestString =
              changeRequestString +
              `${i}. ${data?.metadata} COMMENT: ${decryptField(
                data?.comment
              )}; `;
            i++;
          });
        }

        {
          return changeRequestString;
        }
      },

      // fixed: "right",
      // width: 100,
    },
  ];

  return (
    <>
      <Button style={{ margin: '10px' }} onClick={handleBack} type="default">
        Back to patient selector
      </Button>

      <PageHeader className="site-page-header" title="Patient Profile" />
      <div style={{ padding: '30px' }}>
        <Space direction="vertical" size="middle">
          {patientData && (
            <>
              <PatientCard patientData={patientData} />
              <br></br>
              <Button type="primary" onClick={handleClickRestraints}>
                Submit Restraints Form
              </Button>
              <Button
                type="primary"
                onClick={handleClickProgressRecord}
                style={{ background: '#32a852' }}
              >
                Submit Progress Record Form
              </Button>
              <br></br>
              {userRole == 'full' && (
                <>
                  <h4>Monitoring Toggle</h4>
                  <p>Restraints Monitoring:</p>
                  <Switch
                    defaultChecked={patientData.restraintsMonitoring}
                    onChange={restraintsStatusChange}
                  />{' '}
                  Progress Record Monitoring:
                  <Switch
                    defaultChecked={patientData.progressRecordMonitoring}
                    onChange={progressRecordStatusChange}
                  />
                </>
              )}

              <br></br>
              <Space direction="vertical" size={12}>
                <span>Select Date for Reports below</span>
                <RangePicker
                  defaultValue={[
                    moment().add(-2, 'days').startOf('day'),
                    moment().startOf('day'),
                  ]}
                  onChange={(e) => {
                    let endDate = e[1];
                    endDate = moment(endDate).endOf('day');
                    setRestraintsDatePicker([e[0], endDate]);
                  }}
                />
              </Space>
              <h3>Restraints Form submission history</h3>
              <Button
                style={{ margin: '10px' }}
                onClick={generateRestraintsPDF}
                type="default"
              >
                Export Restraints Data
              </Button>
              <div className="pcf">
                {/* <RCTable
                  style={{ width: mobileView ? 400 : 1100 }}
                  scroll={{ x: 300 }}
                  columns={restraintsColumns}
                  className="table"
                  data={restraintsSubmissions}
                /> */}
                {restraintsSubmissions && (
                  <>
                    {userRole == 'full' ? (
                      <BootstrapTable
                        keyField="id"
                        data={restraintsSubmissions}
                        columns={restraintsColumns}
                        changeRequest={changeRequest}
                      />
                    ) : (
                      <BootstrapTable
                        keyField="id"
                        data={restraintsSubmissions}
                        columns={restraintsColumnsRestricted}
                        changeRequest={changeRequest}
                      />
                    )}
                  </>
                )}
              </div>
              <h3>Progress Record Form submission history</h3>
              <Button
                style={{ margin: '10px' }}
                onClick={generateProgressRecordPDF}
                type="default"
              >
                Export Progress Record Data
              </Button>
              <div className="pcf">
                {progressRecordSubmissions && (
                  <>
                    {userRole == 'full' ? (
                      <BootstrapTable
                        keyField="id"
                        data={progressRecordSubmissions}
                        columns={progressRecordColumns}
                        changeRequest={changeRequest}
                      />
                    ) : (
                      <BootstrapTable
                        keyField="id"
                        data={progressRecordSubmissions}
                        columns={progressRecordColumnsRestricted}
                        changeRequest={changeRequest}
                      />
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {patientError && <p>{patientError}</p>}
        </Space>
      </div>

      <Modal
        title="Change Request"
        visible={isModalVisible}
        onOk={handleChangeRequestSubmit}
        onCancel={handleCancel}
      >
        {changeRequestRow && <p>{changeRequestRow.row}</p>}
        <Input
          name="changeRequest"
          onChange={handleChangeRequestComment}
        ></Input>

        {/* {readmitError && <Alert message={readmitError} type="error" />} */}
      </Modal>
    </>
  );
}

export default PatientProfile;
