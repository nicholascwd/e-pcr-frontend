import React, { useEffect, useState } from "react";
import { PageHeader, Form } from "antd";
import { Typography, Table, Space, Button, Input, Result, Alert } from "antd";
import axios from "axios";
import moment from "moment-timezone";
import {
  getToken,
  getUser,
  removeUserSession,
  setUserSession,
} from "../../Utils/Common";
import { encryptField } from "../../Utils/EncryptContents";

function AdmitResident(props) {
  const token = getToken();

  const { Text, Link } = Typography;
  const [submitted, setSubmitted] = useState(false);
  const [admitError, setAdmitError] = useState();
  const formItemLayout = {
    labelCol: {
      span: 30,
      offset: 0,
    },
    wrapperCol: {
      span: 50,
    },
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      props.history.push("/login");
      return;
    }
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/verifyToken?token=${token}`)
      .then((response) => {})
      .catch((error) => {
        removeUserSession();
      });
  }, []);

  function handleBack() {
    props.history.push("/residents_module");
  }

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    //submit restraints form
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/residents/admit`,
        {
          bed: values.bed.toUpperCase(),
          name: encryptField(values.name.toUpperCase()),
          NRIC: encryptField(values.NRIC.toUpperCase()),
        },
        { headers: { token: token } }
      )
      .then((response) => {
        setSubmitted(true);
        setAdmitError(null);
        //console.log(response.data[0])
      })
      .catch((error) => {
        console.log(error.response.data.message);
        setAdmitError(error.response.data.message);
        //   setPatientError(error.response.data.error)
      });
  };

  return (
    <>
      <Button style={{ margin: "10px" }} onClick={handleBack} type="default">
        Back
      </Button>
      <PageHeader className="site-page-header" title="Admit Patient" />
      <div style={{ padding: "30px" }}>
        <Space direction="vertical" size="middle">
          {admitError && (
            <>
              <Alert
                message="Error"
                description={admitError}
                type="error"
                showIcon
              />
            </>
          )}

          {!submitted && (
            <div>
              <Form
                name="validate_other"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Form.Item name="name" label="Resident Name" required>
                  <Input required />
                </Form.Item>
                <Form.Item name="NRIC" label="NRIC" required>
                  <Input required />
                </Form.Item>
                <Form.Item name="bed" label="Resident Bed" required>
                  <Input required />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}

          {submitted && (
            <Result
              status="success"
              title="Success!"
              subTitle="Patient Admitted"
              extra={[
                <Button type="primary" onClick={handleBack} key="console">
                  Back
                </Button>,
              ]}
            />
          )}
        </Space>
      </div>
    </>
  );
}

export default AdmitResident;
