import React, { useEffect, useState } from 'react';
import {
  PageHeader
} from 'antd';
import { Typography, Space, Button, Table} from 'antd';
import axios from 'axios';
import moment from 'moment-timezone';
import {
  getToken, getUser, removeUserSession, setUserSession,
} from '../Utils/Common';
import { useParams } from 'react-router';
import { decryptField, decryptObject, encryptField } from '../Utils/EncryptContents';




function PatientProfile(props) {
  const { Text, Link } = Typography;
  const [patientData,setPatientData] = useState()
  const [patientError,setPatientError] = useState()
  const [restraintsSubmissions,setRestraintsSubmissions] = useState()
  const [progressRecordSubmissions,setProgressRecordSubmissions] = useState()
  
  let { bedNo } = (useParams());
  const token = getToken();
  useEffect(() => {
    
    
    if (!token) {
      props.history.push("/login")
      return;
    }
    axios.get(`${process.env.REACT_APP_API_URL}/users/verifyToken?token=${token}`).then((response) => {
      console.log(response)
    }).catch((error) => {
      removeUserSession();
    });
    //obtain resident details based on bed from url params
    axios.post(`${process.env.REACT_APP_API_URL}/residents/getByBed`,{bed:bedNo},{headers:{token:token}}).then((response) => {
        setPatientData(response.data[0])
        console.log(response.data[0])
        
    }).catch((error) => {
      console.log(error)
      setPatientError(error.response.data.error)
    });

  }, []);


  useEffect(()=>{

      console.log("pd",patientData)
      //    //obtain resident restraint's form submission history
      if(patientData){

        axios.post(`${process.env.REACT_APP_API_URL}/forms/restraintsForm/submissionHistory`,{uuid:patientData.uuid},{headers:{token:token}}).then((response) => {
          var formDataPros = response.data
          formDataPros.map((el)=>{
            el.formVals= decryptObject((el.formData)) 
        })
          setRestraintsSubmissions(formDataPros)
          
      }).catch((error) => {
        console.log(error)
  
      });
  

      axios.post(`${process.env.REACT_APP_API_URL}/forms/progressRecordForm/submissionHistory`,{uuid:patientData.uuid},{headers:{token:token}}).then((response) => {
        var formDataPros2 = response.data
        formDataPros2.map((el)=>{
          el.formVals = decryptObject(el.formData)
      })
         setProgressRecordSubmissions(formDataPros2)
        
    }).catch((error) => {
      console.log(error)

    });



      }

  
     
      

  },[patientData])


  function handleClickRestraints(){
    props.history.push("/forms/restraints_form/"+patientData.uuid,"_self");
  }
  function handleClickProgressRecord(){
    props.history.push("/forms/progress_record_form/"+patientData.uuid,"_self");
  }


  

  function handleBack(){
    props.history.push("/select_patient","_self");
  }

  const restraintsColumns = [
    {
      title:'Date',
      key: '_id',
      dataIndex:'formVals',
      fixed: 'left',
      width:100,
      render: text => <p>{JSON.parse(text).date}</p>,
    },
    {
      title:'Time',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).time}</p>,
  
    },
    {
      title:'Applied Correctly',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).r1}</p>,

    },
    {
      title:'Comfortable',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).r2}</p>,

    },
    {
      title:'Circulation',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).r3}</p>,

    },
    {
      title:'ROM',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).r4}</p>,
      width:10
    },
    {
      title:'Skin Checked',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).r5}</p>,
  
    },
    {
      title:'Type of Restraints',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{(JSON.parse(text)["r-restraints-type"])}</p>,

    },
    {
      title:'Remarks',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{(JSON.parse(text)["r-remarks"])}</p>,

    },
    {
      title:'Staff',
      key: '_id',
      dataIndex:'staff',

    },
    {
      title:'Submitted D/T',
      key: '_id',
      dataIndex:'creationDate',
      render: text => <p>{moment(text).format('MMMM Do YYYY, h:mm:ss a')}</p>,
   
    }]


  const progressRecordColumns = [
    {
      title:'Date',
      key: '_id',
      dataIndex:'formVals',
      fixed: 'left',
      width:100,
      render: text => <p>{JSON.parse(text).date}</p>,
    },
    {
      title:'Time',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).time}</p>,
  
    },
    {
      title:'General Condition',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).p1}</p>,

    },
    {
      title:'Mental State',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).p2}</p>,

    },
    {
      title:'Skin Care',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).p3}</p>,

    },
    {
      title:'Hygiene/Bathing',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).p4}</p>,
      width:10
    },
    {
      title:'Oral Care',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).p5}</p>,
  
    },
    {
      title:'Feeding',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).p6}</p>,
  
    },
    {
      title:'Bladder',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).p7}</p>,
  
    },
    {
      title:'Bowel',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).p8}</p>,
  
    },
    {
      title:'Mobility',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).p9}</p>,
  
    },
    {
      title:'Rest at Night',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).p10}</p>,
  
    },
    {
      title:'Therapy',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).p11}</p>,
  
    },
    {
      title:'Visited',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{JSON.parse(text).p12}</p>,
  
    },
    {
      title:'Remarks',
      key: '_id',
      dataIndex:'formVals',
      render: text => <p>{(JSON.parse(text)["r-remarks"])}</p>,

    },
    {
      title:'Staff',
      key: '_id',
      dataIndex:'staff',

    },
    {
      title:'Submitted D/T',
      key: '_id',
      dataIndex:'creationDate',
      render: text => <p>{moment(text).format('MMMM Do YYYY, h:mm:ss a')}</p>,
   
    }]

  return (
    <>
     <Button style={{margin:'10px'}} onClick={handleBack} type="default" >Back to patient selector</Button>
    <PageHeader
    className="site-page-header"
    title="Patient Profile"
  />
    <div style={{padding:"30px"}}>
      <Space direction="vertical" size="middle">
     

{patientData && <>

    <h3>Bed: {patientData.bed}
    <br></br>
    Name: {decryptField(patientData.name)}
    <br></br>
    NRIC: {decryptField(patientData.NRIC)}
    <br></br>
    Profile Creation: {moment(patientData.creationDate).format('MMMM Do YYYY, h:mm:ss a')}
    <br></br>
    Status: {patientData.status}</h3>
    <p>Identifier: {patientData.uuid}</p>

    <Button type="primary" onClick={handleClickRestraints}>Submit Restraints Form</Button>
    <Button type="primary" onClick={handleClickProgressRecord} >Submit Progress Record Form</Button>

    <br></br><br></br>
    <h3>Restraints Form submission history</h3>



    
    <Table columns={restraintsColumns} dataSource={restraintsSubmissions} className="preview-batch-table" />
  
    <h3>Progress Record Form submission history</h3>
    <Table columns={progressRecordColumns} dataSource={progressRecordSubmissions} className="preview-batch-table" />



</>}




{patientError && <p>{patientError}</p>}
  

       
      </Space>
      </div>


    </>
  );
}

export default PatientProfile;
