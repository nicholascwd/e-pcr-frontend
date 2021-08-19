import React, { useEffect, useState } from 'react';
import {
  PageHeader,
  Form,
  Select,
  Radio,
  Button,
  Result,
  Space,
  Input,
  DatePicker,
  Checkbox,
} from 'antd';
import axios from 'axios';
import moment from 'moment-timezone';
import { getToken, getUser, removeUserSession } from '../../Utils/Common';
import { useParams } from 'react-router';
import { encryptObject } from '../../Utils/EncryptContents';
import PatientCard from '../ResidentsModule/PatientCard';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 30,
    offset: 0,
  },
  wrapperCol: {
    span: 50,
  },
};

function ProgressRecordForm(props) {
  const [patientData, setPatientData] = useState();
  const [patientError, setPatientError] = useState();
  const [staff, setStaff] = useState();
  const [submitted, setSubmitted] = useState(false);

  let { uuid } = useParams();

  const token = getToken();
  useEffect(() => {
    if (!token) {
      props.history.push('/login');
      return;
    }
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/verifyToken?token=${token}`)
      .then((response) => {
        //console.log(response)
        setStaff(getUser().username);
      })
      .catch((error) => {
        removeUserSession();
      });

    //obtain resident details based on uuid from url params
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/residents/getByUUID`,
        { uuid: uuid },
        { headers: { token: token } }
      )
      .then((response) => {
        setPatientData(response.data[0]);
        //console.log(response.data[0])
      })
      .catch((err) => {
        console.log(err);
        // setPatientError(error.response.data.error);
      });
  }, []);

  const onFinish = (values) => {
    if (!values.time) {
      alert('Time is missing');
      return;
    }
    const dateTime = moment(values['date']).startOf('day');
    values['date'] = values['date'].format('YYYY-MM-DD');
    console.log('Received values of form: ', values);
    //submit restraints form
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/forms/progressRecordForm/submit`,
        {
          resident: uuid,
          formData: encryptObject(values),
          dateTime: dateTime,
          timeslot: values.time,
          bed: patientData.bed,
        },
        { headers: { token: token } }
      )
      .then((response) => {
        setSubmitted(true);
        //console.log(response.data[0])
      })
      .catch((error) => {
        console.log(error.response.data.error);
        setPatientError(error.response.data.error);
      });
  };
  function handleNewPatient() {
    props.history.push('/select_patient/', '_self');
  }
  function handleNewFormSamePatient() {
    props.history.push('/patient_profile/' + patientData.bed, '_self');
  }

  return (
    <>
      <Button
        style={{ margin: '10px' }}
        onClick={handleNewFormSamePatient}
        type="default"
      >
        Back to patient profile
      </Button>
      <PageHeader className="site-page-header" title="Progress Record Form" />
      <div style={{ padding: '30px' }}>
        <Space direction="vertical" size="middle">
          {patientData && staff && !submitted && (
            <>
              <PatientCard patientData={patientData} />
              <Form
                name="validate_other"
                {...formItemLayout}
                onFinish={onFinish}
                initialValues={
                  {
                    // ["p1"]: "Satisfactory" ,
                    // ["p2"]: "Oriented",
                    // ["p3"]: "Intact",
                    // ["p4"]: "Self",
                    // ["p5"]: "Self",
                    // ["p6"]: "Self",
                    // ["p7"]: "Continent",
                    // ["p8"]: "Bowel Opened",
                    // ["p9"]: "Ambulant",
                    // ["p10"]: "Good",
                    // ["p11"]: "Active Exercise",
                    // ["p12"]: "No",
                  }
                }
              >
                <Form.Item name="date" label="Date" required>
                  <DatePicker />
                </Form.Item>

                <Form.Item name="time" label="Time" required>
                  <Select placeholder="Select time of check" virtual={false}>
                    <Option value="ND">ND</Option>
                    <Option value="AM">AM</Option>
                    <Option value="PM">PM</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="p1" label="1. General Condition">
                  <Radio.Group>
                    <Radio value="Satisfactory">Satisfactory</Radio>
                    <Radio value="Unwell">Unwell</Radio>
                    <Radio value="Poor">Poor</Radio>
                    <Radio value="">NA</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name="p2" label="2. Mental State">
                  <Radio.Group>
                    <Radio value="Oriented">Oriented</Radio>
                    <Radio value="Confused">Confused</Radio>
                    <Radio value="Behavioural Problem">
                      Behavioural Problem
                    </Radio>
                    <Radio value="Uncommunicative">Uncommunicative</Radio>
                    <Radio value="">NA</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name="p3" label="3. Skin Care">
                  <Radio.Group>
                    <Radio value="Intact">Intact</Radio>
                    <Radio value="Impaired/Rashes">Impaired</Radio>
                    <Radio value="Wound Care">Wound Care</Radio>
                    <Radio value="">NA</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name="p4" label="4. Hygiene/Bathing">
                  <Radio.Group>
                    <Radio value="Self">Self</Radio>
                    <Radio value="Assisted Bath">Assisted Bath</Radio>
                    <Radio value="Bed Bath">Bed Bath</Radio>
                    <Radio value="">NA</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name="p5" label="5. Oral Care">
                  <Radio.Group>
                    <Radio value="Self">Self</Radio>
                    <Radio value="Assisted">Assisted</Radio>
                    <Radio value="Totally Dependent">Totally Dependent</Radio>
                    <Radio value="">NA</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name="p6" label="6. Feeding">
                  <Radio.Group>
                    <Radio value="Self">Self</Radio>
                    <Radio value="Assisted">Assisted</Radio>
                    <Radio value="NGT/PEG">NGT/PEG</Radio>
                    <Radio value="">NA</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="p7" label="7. Bladder">
                  <Checkbox.Group>
                    <Checkbox value="Continent">Continent</Checkbox>
                    <Checkbox value="Incontinent(Diaper)">
                      Incontinent(Diaper)
                    </Checkbox>
                    <Checkbox value="IDC/IMC/SPC">IDC/IMC/SPC</Checkbox>
                  </Checkbox.Group>
                </Form.Item>

                <Form.Item name="p8" label="8. Bowel">
                  <Checkbox.Group>
                    <Checkbox value="Bowel Opened ">Bowel Opened</Checkbox>
                    <Checkbox value="Bowel Not Opened">
                      Bowel Not Opened
                    </Checkbox>
                    <Checkbox value="Colostomy Care ">Colostomy Care</Checkbox>
                  </Checkbox.Group>
                </Form.Item>

                <Form.Item name="p9" label="9. Mobility">
                  <Checkbox.Group>
                    <Checkbox value="Ambulant">Ambulant</Checkbox>
                    <Checkbox value="Requires Wheelchair">
                      Requires Wheelchair
                    </Checkbox>
                    <Checkbox value="Requires Walking Aides">
                      Requires Walking Aides
                    </Checkbox>
                    <Checkbox value="Requires 2hrly Turning">
                      Requires 2hrly Turning
                    </Checkbox>
                  </Checkbox.Group>
                </Form.Item>

                <Form.Item name="p10" label="10. Rest During Night">
                  <Radio.Group>
                    <Radio value="Good">Good</Radio>
                    <Radio value="Restless/Interrupted">
                      Restless/Interrupted
                    </Radio>
                    <Radio value="">NA</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name="p11" label="11. Therapy">
                  <Radio.Group>
                    <Radio value="Active Exercise">Active Exercise</Radio>
                    <Radio value="Passive Exercise">Passive Exercise</Radio>
                    <Radio value="">NA</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name="p12" label="12. Visited by Relatives/Friend">
                  <Radio.Group>
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                    <Radio value="">NA</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="r-remarks" label="13. Remarks">
                  <Input />
                </Form.Item>

                <Form.Item name="staff" label="Submitted by">
                  <span className="ant-form-text">{staff}</span>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
          {submitted && (
            <Result
              status="success"
              title="Success!"
              subTitle="You may view the submitted data on patient profile page"
              extra={[
                <Button type="primary" onClick={handleNewPatient} key="console">
                  Select new patient
                </Button>,
                <Button key="buy" onClick={handleNewFormSamePatient}>
                  Submit new form for same patient
                </Button>,
              ]}
            />
          )}

          {patientError && <p>{patientError}</p>}
        </Space>
      </div>
    </>
  );
}

export default ProgressRecordForm;
