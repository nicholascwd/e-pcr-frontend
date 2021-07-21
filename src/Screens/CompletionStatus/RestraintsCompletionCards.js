import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';

function RestraintsCompletionCards(props) {
  //   console.log(props.pendingSubmission);
  const allIncompleteRestraints = props.pendingSubmission;
  const list0000 = allIncompleteRestraints['0000'].map((d) => (
    <li key={d}>
      <a href={`/patient_profile/${d}`}>{d}</a>
    </li>
  ));
  const list0200 = allIncompleteRestraints['0200'].map((d) => (
    <li key={d}>
      <a href={`/patient_profile/${d}`}>{d}</a>
    </li>
  ));
  const list0400 = allIncompleteRestraints['0400'].map((d) => (
    <li key={d}>
      <a href={`/patient_profile/${d}`}>{d}</a>
    </li>
  ));
  const list0600 = allIncompleteRestraints['0600'].map((d) => (
    <li key={d}>
      <a href={`/patient_profile/${d}`}>{d}</a>
    </li>
  ));
  const list0800 = allIncompleteRestraints['0800'].map((d) => (
    <li key={d}>
      <a href={`/patient_profile/${d}`}>{d}</a>
    </li>
  ));
  const list1000 = allIncompleteRestraints['1000'].map((d) => (
    <li key={d}>
      <a href={`/patient_profile/${d}`}>{d}</a>
    </li>
  ));
  const list1200 = allIncompleteRestraints['1200'].map((d) => (
    <li key={d}>
      <a href={`/patient_profile/${d}`}>{d}</a>
    </li>
  ));
  const list1400 = allIncompleteRestraints['1400'].map((d) => (
    <li key={d}>
      <a href={`/patient_profile/${d}`}>{d}</a>
    </li>
  ));
  const list1600 = allIncompleteRestraints['1600'].map((d) => (
    <li key={d}>
      <a href={`/patient_profile/${d}`}>{d}</a>
    </li>
  ));
  const list1800 = allIncompleteRestraints['1800'].map((d) => (
    <li key={d}>
      <a href={`/patient_profile/${d}`}>{d}</a>
    </li>
  ));
  const list2000 = allIncompleteRestraints['2000'].map((d) => (
    <li key={d}>
      <a href={`/patient_profile/${d}`}>{d}</a>
    </li>
  ));
  const list2200 = allIncompleteRestraints['2200'].map((d) => (
    <li key={d}>
      <a href={`/patient_profile/${d}`}>{d}</a>
    </li>
  ));
  return (
    <>
      <h3>Pending Submission for today (Restraints)</h3>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="0000H" bordered={false}>
              {list0000}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="0200H" bordered={false}>
              {list0200}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="0400H" bordered={false}>
              {list0400}
            </Card>
          </Col>
        </Row>
        <br></br>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="0600H" bordered={false}>
              {list0600}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="0800H" bordered={false}>
              {list0800}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="1000H" bordered={false}>
              {list1000}
            </Card>
          </Col>
        </Row>{' '}
        <br></br>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="1200H" bordered={false}>
              {list1200}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="1400H" bordered={false}>
              {list1400}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="1600H" bordered={false}>
              {list1600}
            </Card>
          </Col>
        </Row>
        <br></br>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="1800H" bordered={false}>
              {list1800}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="2000H" bordered={false}>
              {list2000}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="2200H" bordered={false}>
              {list2200}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default RestraintsCompletionCards;
