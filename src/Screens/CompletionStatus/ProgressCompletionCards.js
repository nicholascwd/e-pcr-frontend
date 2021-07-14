import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';

function ProgressCompletionCards(props) {
  console.log(props.pendingSubmission);
  const allIncompleteRestraints = props.pendingSubmission;
  const listND = allIncompleteRestraints['ND'].map((d) => <li key={d}>{d}</li>);
  const listAM = allIncompleteRestraints['AM'].map((d) => <li key={d}>{d}</li>);
  const listPM = allIncompleteRestraints['PM'].map((d) => <li key={d}>{d}</li>);

  return (
    <>
      <h3>Pending Submission for today (Progress Record)</h3>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="ND" bordered={false}>
              {listND}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="AM" bordered={false}>
              {listAM}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="PM" bordered={false}>
              {listPM}
            </Card>
          </Col>
        </Row>
        <br></br>
      </div>
    </>
  );
}

export default ProgressCompletionCards;
