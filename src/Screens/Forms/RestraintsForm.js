import React, { useEffect, useState } from 'react';
import {
  PageHeader,
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Button,
  Upload,
  Rate,
  Checkbox,
  Row,
  Col,
  Result, 
} from 'antd';
import { Typography, AutoComplete, Space, Input, DatePicker} from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import {
  getToken, getUser, removeUserSession, setUserSession,
} from '../../Utils/Common';
import { useParams } from 'react-router';
import { decryptField, encryptField, encryptObject } from '../../Utils/EncryptContents';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 30,
    offset:0,
  },
  wrapperCol: {
    span: 50,
  },
};


function RestraintsForm(props) {
  const { Text, Link } = Typography;
  const [patientData,setPatientData] = useState()
  const [patientError,setPatientError] = useState()
  const [staff,setStaff] = useState()
  const [submitted,setSubmitted] = useState(false)
  
  let { uuid } = useParams();

  const token = getToken();
  useEffect(() => {
    
    if (!token) {
      props.history.push("/login")
      return;
    }
    axios.get(`${process.env.REACT_APP_API_URL}/users/verifyToken?token=${token}`).then((response) => {
      //console.log(response)
      setStaff(getUser().username)
    }).catch((error) => {
      removeUserSession();
    });

    //obtain resident details based on bed from url params
    axios.post(`${process.env.REACT_APP_API_URL}/residents/getByUUID`,{uuid:uuid},{headers:{token:token}}).then((response) => {
        setPatientData(response.data[0])
        //console.log(response.data[0])
    }).catch((error) => {
      console.log(error.response.data.error)
      setPatientError(error.response.data.error)
      
    });
  }, []);

  const onFinish = (values) => {
    values['date'] = values['date'].format('YYYY-MM-DD');
    console.log('Received values of form: ', JSON.stringify(values));
      //submit restraints form
      axios.post(`${process.env.REACT_APP_API_URL}/forms/restraintsForm/submit`,{resident:uuid, formData: encryptObject(values), bed: patientData.bed},{headers:{token:token}}).then((response) => {
        setSubmitted(true)
        //console.log(response.data[0])
    }).catch((error) => {
      console.log(error.response.data.error)
      setPatientError(error.response.data.error)
      
    });
  };
  function handleNewPatient(){
    props.history.push('/select_patient/','_self')
  }
  function handleNewFormSamePatient(){
    props.history.push('/patient_profile/'+patientData.bed,'_self')
  }

  return (
    <>
    <Button style={{margin:'10px'}} onClick={handleNewFormSamePatient} type="default" >Back to patient profile</Button>
    <PageHeader
    className="site-page-header"
    title="Restraints Form"
  />
    <div style={{padding:"30px"}}>
      <Space direction="vertical" size="middle">


{patientData && staff && !submitted &&<>
    <h3>Bed: {patientData.bed}
    <br></br>
    Name: {decryptField(patientData.name)}
    <br></br>
    NRIC: {decryptField(patientData.NRIC)}
    <br></br>
    Profile Creation: {patientData.creationDate}
    <br></br>
    Status: {patientData.status}</h3>
    <p>Identifier: {patientData.uuid}</p>


    <Form
      name="validate_other" {...formItemLayout} onFinish={onFinish}>
        <Form.Item name="date" label="Date" required>
            <DatePicker />
        </Form.Item>

        <Form.Item name="time" label="Time" required>
        <Select placeholder="Select time of check" virtual={false}>
          <Option value="0000">12am midnight</Option>
          <Option value="0200">2am</Option>
          <Option value="0400">4am</Option>
          <Option value="0600">6am</Option>
          <Option value="0800">8am</Option>
          <Option value="1000">10am</Option>
          <Option value="1200">12pm noon</Option>
          <Option value="1400">2pm</Option>
          <Option value="1600">4pm</Option>
          <Option value="1800">6pm</Option>
          <Option value="2000">8pm</Option>
          <Option value="2200">10pm</Option>
        </Select>
      </Form.Item>

        <Form.Item name="r1" label="Restraints applied correctly">
            <Radio.Group>
            <Radio value="Y">Yes</Radio>
            <Radio value="N">No</Radio>
            </Radio.Group>
        </Form.Item>
        <Form.Item name="r2" label="Body & limbs in comfortable position">
            <Radio.Group>
            <Radio value="Y">Yes</Radio>
            <Radio value="N">No</Radio>
            </Radio.Group>
        </Form.Item>
        <Form.Item name="r3" label="(Restrained Extremities) Adequate circulation" >
            <Radio.Group>
            <Radio value="Y">Yes</Radio>
            <Radio value="N">No</Radio>
            </Radio.Group>
        </Form.Item>
        <Form.Item name="r4" label="(Restrained Extremities) Adequate ROM">
            <Radio.Group>
            <Radio value="Y">Yes</Radio>
            <Radio value="N">No</Radio>
            </Radio.Group>
        </Form.Item>
        <Form.Item name="r5" label="Skin integrity checked">
            <Radio.Group >
            <Radio value="Y">Yes</Radio>
            <Radio value="N">No</Radio>
            </Radio.Group>
        </Form.Item>

        <Form.Item
          name="r-restraints-type"
          label="Type of Restraints"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="r-remarks"
          label="Remarks"
        >
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

    

    





</>}
{submitted &&
<Result
    status="success"
    title="Success!"
    subTitle="You may view the submitted data on patient profile page"
    extra={[
      <Button type="primary" onClick={handleNewPatient} key="console">Select new patient</Button>,
      <Button key="buy" onClick={handleNewFormSamePatient}>Submit new form for same patient</Button>,
    ]}
  />
}




{patientError && <p>{patientError}</p>}
  

       
      </Space>
      </div>


    </>
  );
}

export default RestraintsForm;
