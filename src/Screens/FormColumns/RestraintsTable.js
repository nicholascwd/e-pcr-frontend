import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
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
import { getToken, getUser } from '../../Utils/Common';
const token = getToken();
const user = getUser();
import { PageHeader, Switch } from 'antd';

function submitChangeRequest(_id) {
  console.log('modify, ', _id);
  axios
    .post(
      `${process.env.REACT_APP_API_URL}/forms/restraintsForm/modify`,
      {
        formID: _id,
      },
      { headers: { token: token } }
    )
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

function changeRequest() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = (e) => {
    setReadmitResident({ uuid: e.uuid, name: e.name });
    setReadmitError(null);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <p>changeRequest</p>
      <Modal
        title="Readmit Resident"
        visible={isModalVisible}
        // onOk={handleReadmitSubmit}
        onCancel={handleCancel}
      >
        {/* {readmitResident && <p>{readmitResident.name}</p>} */}
        <Input
          name="readmitNewBed"
          addonBefore="Bed"
          // onChange={handleReadmitNewBed}
        ></Input>

        {/* {readmitError && <Alert message={readmitError} type="error" />} */}
      </Modal>
    </>
  );
}

export const restraintsColumns = [
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
    text: 'Action',
    dataField: '_id',
    // width: 50,
    formatter: (_id) => (
      <>
        <Button
          onClick={() => {
            // submitChangeRequest(_id);

            window.open(`/forms/restraints_form/${_id}`, '_self');
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
