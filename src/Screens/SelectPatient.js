import React, { useEffect, useState } from 'react';
import {
  PageHeader
} from 'antd';
import { Typography, AutoComplete, Space, Button, Input} from 'antd';
import axios from 'axios';
import {
  getToken, getUser, removeUserSession, setUserSession,
} from '../Utils/Common';
import { decryptField } from '../Utils/EncryptContents';




function SelectPatient(props) {
  const { Text, Link } = Typography;
  const [options,setOptions] = useState()
  const [selected,setSelected] = useState()

  useEffect(() => {
    
    const token = getToken();
    if (!token) {
      props.history.push("/login")
      return;
    }
    axios.get(`${process.env.REACT_APP_API_URL}/users/verifyToken?token=${token}`).then((response) => {
      //console.log(response)
      //console.log(getUser())
    }).catch((error) => {
      removeUserSession();
    });

    //populate list of admitted residents
    axios.post(`${process.env.REACT_APP_API_URL}/residents/listAdmitted`,{},{headers:{token:token}}).then((response) => {
      let beds = response.data
      beds.map((el)=>{
        el.value = el.bed
        // delete el.bed
        })
        console.log(beds)
      setOptions(beds)
      //console.log(response.data)
    }).catch((error) => {
      console.log(error)
    });
  }, []);

  const onSelect = (val, option) => {
    setSelected(option.value);

  };

  function handleSubmit(){
    props.history.push("/patient_profile/"+selected,"_self");
  }



  return (
    <>
    <PageHeader
    className="site-page-header"
    title="Select Patient"
  />
    <div style={{padding:"30px"}}>
      <Space direction="vertical" size="middle">

<Text>Input Patient Bed</Text>



<AutoComplete
    style={{
      width: 200,
    }}
    options={options}
    placeholder="Select"
    onSelect={(val, option) => onSelect(val, option)}
    filterOption={(inputValue, option) =>
      option.value.indexOf(inputValue) !== -1
    }
    virtual={false}
  />
   {selected&& 
     <div>
      <p>Selected Bed: {selected}</p>
      <Button type="primary" onClick={handleSubmit}>Submit</Button>
     </div>}


       
      </Space>
      </div>


    </>
  );
}

export default SelectPatient;
