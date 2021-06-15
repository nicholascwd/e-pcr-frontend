import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import { decryptField } from '../../Utils/EncryptContents';
export const progressRecordPdfExport = (
  patientData,
  progressRecordSubmissions
) => {
  const doc = new jsPDF('landscape');

  doc.text('Progress Record Report', 5, 15);
  doc.setFontSize(10);
  doc.text('Resident Name: ' + decryptField(patientData.name), 5, 30);
  doc.text('Resident NRIC: ' + decryptField(patientData.NRIC), 5, 35);
  doc.text('Report Generated: ' + moment().toDate(), 5, 40);
  doc.setFontSize(7);

  let tableData = [];

  for (let i = 0; i < progressRecordSubmissions.length; i++) {
    let row = [];
    console.log(JSON.parse(progressRecordSubmissions[i].formVals));
    row.push(JSON.parse(progressRecordSubmissions[i].formVals).date);
    row.push(JSON.parse(progressRecordSubmissions[i].formVals).time);
    row.push(JSON.parse(progressRecordSubmissions[i].formVals).p1);
    row.push(JSON.parse(progressRecordSubmissions[i].formVals).p2);
    row.push(JSON.parse(progressRecordSubmissions[i].formVals).p3);
    row.push(JSON.parse(progressRecordSubmissions[i].formVals).p4);
    row.push(JSON.parse(progressRecordSubmissions[i].formVals).p5);
    row.push(JSON.parse(progressRecordSubmissions[i].formVals).p6);
    row.push(JSON.parse(progressRecordSubmissions[i].formVals).p7);
    row.push(JSON.parse(progressRecordSubmissions[i].formVals).p8);
    row.push(JSON.parse(progressRecordSubmissions[i].formVals).p9);
    row.push(JSON.parse(progressRecordSubmissions[i].formVals).p10);
    row.push(JSON.parse(progressRecordSubmissions[i].formVals).p11);
    row.push(JSON.parse(progressRecordSubmissions[i].formVals).p12);
    row.push(JSON.parse(progressRecordSubmissions[i].formVals)['r-remarks']);
    row.push(progressRecordSubmissions[i].staff);
    tableData.push(row);
  }

  doc.autoTable({
    startY: 50,
    styles: { fontSize: 7 },
    head: [
      [
        'Date',
        'Time',
        'General Condition',
        'Mental State	',
        'Skin Care',
        'Hygiene/Bathing',
        'Oral Care',
        'Feeding',
        'Bladder',
        'Bowel',
        'Mobility',
        'Rest at Night',
        'Therapy',
        'Visited',
        'Remarks',
        'Staff Signature',
      ],
    ],
    body: tableData,
  });

  doc.save('table.pdf');
};
