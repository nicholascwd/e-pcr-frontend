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

function RestraintsForm(props) {
  const [patientData, setPatientData] = useState();
  const [patientError, setPatientError] = useState();
  const [selectedDateTime, setSelectedDateTime] = useState(null);
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
      })
      .catch((error) => {
        console.log(error.response.data.error);
        setPatientError(error.response.data.error);
      });
  }, []);

  const onFinish = (values) => {
    if (!values.time) {
      alert('Time is missing');
      return;
    }

    const dateTime = moment(values['date']).startOf('day');
    values['date'] = values['date'].format('YYYY-MM-DD');
    console.log('Received values of form: ', JSON.stringify(values));
    //submit restraints form
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/forms/restraintsForm/submit`,
        {
          resident: uuid,
          formData: encryptObject(values),
          bed: patientData.bed,
          dateTime: dateTime,
          timeslot: values.time,
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
      <PageHeader className="site-page-header" title="Restraints Form" />
      <div style={{ padding: '30px' }}>
        <Space direction="vertical" size="middle">
          {patientData && staff && !submitted && (
            <>
              <PatientCard patientData={patientData} />

              <Form
                name="validate_other"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Form.Item name="date" label="Date" required>
                  <DatePicker />
                </Form.Item>

                <Form.Item
                  onChange={() => {
                    console.log('time change');
                  }}
                  name="time"
                  label="Time"
                  required
                >
                  <Select placeholder="Select time of check" virtual={false}>
                    <Option value="0000">0000</Option>
                    <Option value="0200">0200</Option>
                    <Option value="0400">0400</Option>
                    <Option value="0600">0600</Option>
                    <Option value="0800">0800</Option>
                    <Option value="1000">1000</Option>
                    <Option value="1200">1200</Option>
                    <Option value="1400">1400</Option>
                    <Option value="1600">1600</Option>
                    <Option value="1800">1800</Option>
                    <Option value="2000">2000</Option>
                    <Option value="2200">2200</Option>
                  </Select>
                </Form.Item>

                {selectedDateTime && (
                  <>
                    <p>{selectedDateTime}</p>
                    <p>{}</p>
                  </>
                )}

                <Form.Item name="r1" label="1. Restraints applied correctly">
                  <Radio.Group>
                    <Radio value="Y">Yes</Radio>
                    <Radio value="N">No</Radio>
                    <Radio value="">NA</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  name="r2"
                  label="2. Body & limbs in comfortable position"
                >
                  <Radio.Group>
                    <Radio value="Y">Yes</Radio>
                    <Radio value="N">No</Radio>
                    <Radio value="">NA</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  name="r3"
                  label="3. (Restrained Extremities) Adequate circulation"
                >
                  <Radio.Group>
                    <Radio value="Y">Yes</Radio>
                    <Radio value="N">No</Radio>
                    <Radio value="">NA</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  name="r4"
                  label="4. (Restrained Extremities) Adequate ROM"
                >
                  <Radio.Group>
                    <Radio value="Y">Yes</Radio>
                    <Radio value="N">No</Radio>
                    <Radio value="">NA</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name="r5" label="5. Skin integrity checked">
                  <Radio.Group>
                    <Radio value="Y">Yes</Radio>
                    <Radio value="N">No</Radio>
                    <Radio value="">NA</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  name="r-restraints-type"
                  label="6. Type of Restraints"
                >
                  <Input />
                </Form.Item>
                <Form.Item name="r-remarks" label="7. Remarks">
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

export default RestraintsForm;
