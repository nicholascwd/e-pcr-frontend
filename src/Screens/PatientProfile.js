import React, { useEffect, useState } from 'react';
import { PageHeader, Space, Button, Table, DatePicker } from 'antd';
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import RCTable from 'rc-table';

import axios from 'axios';
import moment from 'moment-timezone';

import { getToken, removeUserSession } from '../Utils/Common';
import { useParams } from 'react-router';
import { decryptField, decryptObject } from '../Utils/EncryptContents';
import { restraintsPdfExport } from './PDFExport/RestraintsExport';
import { restraintsColumns } from './AntTablesForms/RestraintsTable';
import { progressRecordColumns } from './AntTablesForms/ProgressRecordTable';
import { progressRecordPdfExport } from './PDFExport/ProgressRecordExport';
import '../Assets/index.less';

function PatientProfile(props) {
  const [patientData, setPatientData] = useState();
  const [patientError, setPatientError] = useState();
  const [restraintsSubmissions, setRestraintsSubmissions] = useState();
  const [restraintsDatePicker, setRestraintsDatePicker] = useState([
    moment().add(-2, 'days').startOf('day'),
    moment().endOf('day'),
  ]);
  const [progressRecordSubmissions, setProgressRecordSubmissions] = useState();
  const { RangePicker } = DatePicker;

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

  useEffect(() => {
    //    //obtain resident restraint's form submission history
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
          var formDataPros = response.data;
          formDataPros.map((el) => {
            el.formVals = decryptObject(el.formData);
          });
          setRestraintsSubmissions(formDataPros);
          console.log(formDataPros);
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
          var formDataPros2 = response.data;
          formDataPros2.map((el) => {
            el.formVals = decryptObject(el.formData);
          });
          setProgressRecordSubmissions(formDataPros2);
          // console.log(formDataPros2)
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [patientData, restraintsDatePicker]);

  const mql = window.matchMedia('(max-width: 600px)');

  let mobileView = mql.matches;

  function handleClickRestraints() {
    props.history.push('/forms/restraints_form/' + patientData.uuid, '_self');
  }

  function handleClickProgressRecord() {
    props.history.push(
      '/forms/progress_record_form/' + patientData.uuid,
      '_self'
    );
  }

  function handleBack() {
    props.history.push('/select_patient', '_self');
  }
  function generateRestraintsPDF() {
    restraintsPdfExport(patientData, restraintsSubmissions);
  }
  function generateProgressRecordPDF() {
    progressRecordPdfExport(patientData, progressRecordSubmissions);
  }

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
              <h4>
                Bed: {patientData.bed}
                <br></br>
                Name: {decryptField(patientData.name)}
                <br></br>
                NRIC: {decryptField(patientData.NRIC)}
                <br></br>
                Profile Creation:{' '}
                {moment(patientData.creationDate).format(
                  'MMMM Do YYYY, h:mm:ss a'
                )}
                <br></br>
                Status: {patientData.status}
              </h4>
              <p>Identifier: {patientData.uuid}</p>

              <Button type="primary" onClick={handleClickRestraints}>
                Submit Restraints Form
              </Button>
              <Button type="primary" onClick={handleClickProgressRecord}>
                Submit Progress Record Form
              </Button>

              <br></br>
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
                    console.log(moment(endDate).format());
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
                <RCTable
                  style={{ width: mobileView ? 400 : 1100 }}
                  scroll={{ x: 300 }}
                  columns={restraintsColumns}
                  className="table"
                  data={restraintsSubmissions}
                />
              </div>
              {/* <div className="overflowTable">
                <Table
                  columns={restraintsColumns}
                  dataSource={restraintsSubmissions}
                  className="preview-batch-table"
                  scroll={{ x: 'max-content' }}
                />
              </div> */}

              {/* {restraintsSubmissions && (
                <div className="overflowTable">
                  <BootstrapTable
                    pagination={paginationFactory()}
                    wrapperClasses="table-responsive"
                    keyField="id"
                    data={restraintsSubmissions}
                    columns={restraintsColumns}
                  />
                </div>
              )} */}

              <h3>Progress Record Form submission history</h3>
              <Button
                style={{ margin: '10px' }}
                onClick={generateProgressRecordPDF}
                type="default"
              >
                Export Progress Record Data
              </Button>

              <div className="pcf">
                <RCTable
                  style={{ width: mobileView ? 400 : 1100 }}
                  scroll={{ x: 300 }}
                  columns={progressRecordColumns}
                  data={progressRecordSubmissions}
                  className="table"
                />
              </div>
              {/* <div className="overflowTable">
                <Table
                  columns={progressRecordColumns}
                  dataSource={progressRecordSubmissions}
                  // scroll={{ x: 'max-content' }}
                  scroll={{ x: true }}
                  className="preview-batch-table"
                />
              </div> */}
              {/* {progressRecordSubmissions && (
                <div className="overflowTable">
                  <BootstrapTable
                    pagination={paginationFactory()}
                    wrapperClasses="table-responsive"
                    keyField="id"
                    data={progressRecordSubmissions}
                    columns={progressRecordColumns}
                  />
                </div>
              )} */}
            </>
          )}

          {patientError && <p>{patientError}</p>}
        </Space>
      </div>
    </>
  );
}

export default PatientProfile;
