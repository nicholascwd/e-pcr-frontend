import React, { useEffect, useState } from 'react';
import {
  PageHeader,
  Form,
  Select,
  Radio,
  Button,
  Result,
  Space,
  Modal,
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

function ChangeRequestModal(props) {
  const [isModalVisible, setIsModalVisible] = useState(true);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
}

export default ChangeRequestModal;
