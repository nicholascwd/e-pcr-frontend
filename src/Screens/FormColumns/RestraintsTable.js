import moment from 'moment-timezone';
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
    text: 'Restrained Limbs',
    children: [
      {
        text: 'Adequate Circulation',
        key: '_id',
        dataField: 'formVals',
        // width: 50,
        formatter: (text) => <p>{JSON.parse(text).r3}</p>,
      },
      {
        text: 'Adequate ROM',
        key: '_id',
        dataField: 'formVals',
        // width: 50,
        formatter: (text) => <p>{JSON.parse(text).r4}</p>,
      },
    ],
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
];
