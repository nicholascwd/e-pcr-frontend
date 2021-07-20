import React from 'react';
import { decryptField } from '../../Utils/EncryptContents';
import moment from 'moment-timezone';

function PatientCard(props) {
  return (
    <>
      <h4>
        Bed: {props.patientData.bed}
        <br></br>
        Name: {decryptField(props.patientData.name)}
        <br></br>
        NRIC: {decryptField(props.patientData.NRIC)}
        <br></br>
        Profile Creation:{' '}
        {moment(props.patientData.creationDate).format(
          'MMMM Do YYYY, h:mm:ss a'
        )}
        <br></br>
        Status: {props.patientData.status}
      </h4>
      <p>Identifier: {props.patientData.uuid}</p>
    </>
  );
}

export default PatientCard;
