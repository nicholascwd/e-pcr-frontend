import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import { decryptField } from '../../Utils/EncryptContents';
export const restraintsPdfExport = (patientData, restraintsSubmissions) => {
  const doc = new jsPDF('landscape');

  doc.text('Restraints Report', 5, 15);
  doc.setFontSize(10);
  doc.text('Resident Name: ' + decryptField(patientData.name), 5, 30);
  doc.text('Resident NRIC: ' + decryptField(patientData.NRIC), 5, 35);
  doc.text('Report Generated: ' + moment().toDate(), 5, 40);

  let tableData = [];

  for (let i = 0; i < restraintsSubmissions.length; i++) {
    let row = [];
    console.log(JSON.parse(restraintsSubmissions[i].formVals).time);
    row.push(JSON.parse(restraintsSubmissions[i].formVals).date);
    row.push(JSON.parse(restraintsSubmissions[i].formVals).time);
    row.push(JSON.parse(restraintsSubmissions[i].formVals).r1);
    row.push(JSON.parse(restraintsSubmissions[i].formVals).r2);
    row.push(JSON.parse(restraintsSubmissions[i].formVals).r3);
    row.push(JSON.parse(restraintsSubmissions[i].formVals).r4);
    row.push(JSON.parse(restraintsSubmissions[i].formVals).r5);
    row.push(
      JSON.parse(restraintsSubmissions[i].formVals)['r-restraints-type']
    );
    row.push(JSON.parse(restraintsSubmissions[i].formVals)['r-remarks']);
    row.push(restraintsSubmissions[i].staff);
    tableData.push(row);
  }

  doc.autoTable({
    startY: 50,
    head: [
      [
        'Date',
        'Time',
        'Applied Correctly',
        'Comfortable',
        'Circulation',
        'ROM',
        'Skin Checked',
        'Restraints Type',
        'Remarks',
        'Staff Signature',
      ],
    ],
    body: tableData,
  });

  doc.save('table.pdf');
};
