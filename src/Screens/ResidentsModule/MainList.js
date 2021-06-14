import React, { useEffect, useState } from 'react';
import {
  PageHeader
} from 'antd';
import { Typography, Table, Space, Button, Input} from 'antd';
import axios from 'axios';
import moment from 'moment-timezone';
import {
  getToken, getUser, removeUserSession, setUserSession,
} from '../../Utils/Common';
import { decryptField } from '../../Utils/EncryptContents';




function ResidentsModuleMainList(props) {
  const { Text, Link } = Typography;
  const [patientData,setPatientData] = useState()

  useEffect(() => {
    
    const token = getToken();
    if (!token) {
      props.history.push("/login")
      return;
    }
    axios.get(`${process.env.REACT_APP_API_URL}/users/verifyToken?token=${token}`).then((response) => {
    }).catch((error) => {
      removeUserSession();
    });

    //populate list of admitted residents
    axios.post(`${process.env.REACT_APP_API_URL}/residents/listAdmittedFullDetails`,{},{headers:{token:token}}).then((response) => {
      let beds = response.data
        console.log(beds)
        beds.map((el)=>{
          el.name= decryptField((el.name)) 
          el.NRIC= decryptField((el.NRIC)) 
      })

      //console.log(response.data)
      setPatientData(beds)
    }).catch((error) => {
      console.log(error)
    });
  }, []);

  function onChange(sorter) {
    console.log('params', sorter);
  }


  const columns = [
    {
      title:'Unique ID',
      key: '_id',
      dataIndex:'uuid',
      fixed: 'left',
    },
    {
      title:'Name',
      key: '_id',
      dataIndex:'name',
    },
    {
      title:'NRIC',
      key: '_id',
      dataIndex:'NRIC',
    },
    {
      title:'Bed',
      key: '_id',
      dataIndex:'bed',
    },
    {
      title:'Initial admission',
      key: '_id',
      dataIndex:'creationDate',
      render: text => <p>{moment(text).format('MMMM Do YYYY, h:mm:ss a')}</p>,

    }, {
        title: 'Action',
        key: 'action',
        width:100,
        render: (data) => (
          <Space size="middle">
            <a onClick={()=>{props.history.push("/patient_profile/"+data.bed)}}>View Patient</a>
            <a onClick={()=>{props.history.push("/patient_profile/"+data.bed)}}>Discharge</a>
          </Space>
        ),
      },]


  return (
    <>
    <PageHeader
    className="site-page-header"
    title="Residents Module"
  />
    <div style={{padding:"30px"}}>
      <Space direction="vertical" size="middle">
<Button onClick={()=>{props.history.push('/residents_module/admit')}}>Admit New Patient</Button>
{/* <Text>Input Patient Bed</Text> */}
<h3>Table of Admitted Patients (Discharge function not functional yet)</h3>
<Table columns={columns} dataSource={patientData} onChange={onChange}/>


 


       
      </Space>
      </div>


    </>
  );
}

export default ResidentsModuleMainList;
