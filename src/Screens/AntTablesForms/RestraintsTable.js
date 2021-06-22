import moment from 'moment-timezone';
export const restraintsColumns = [
  {
    title: 'Date',
    key: '_id',
    dataIndex: 'formVals',
    // fixed: "left",
    // width: 100,
    render: (text) => <p>{JSON.parse(text).date}</p>,
  },
  {
    title: 'Time',
    key: '_id',
    dataIndex: 'formVals',
    // width: 50,
    render: (text) => <p>{JSON.parse(text).time}</p>,
  },
  {
    title: 'Restraints Applied Correctly',
    key: '_id',
    dataIndex: 'formVals',
    // width: 50,
    render: (text) => <p>{JSON.parse(text).r1}</p>,
  },
  {
    title: 'Body & Limbs Comfortable',
    key: '_id',
    dataIndex: 'formVals',
    // width: 50,
    render: (text) => <p>{JSON.parse(text).r2}</p>,
  },
  {
    title: 'Restrained Limbs',
    children: [
      {
        title: 'Adequate Circulation',
        key: '_id',
        dataIndex: 'formVals',
        // width: 50,
        render: (text) => <p>{JSON.parse(text).r3}</p>,
      },
      {
        title: 'Adequate ROM',
        key: '_id',
        dataIndex: 'formVals',
        // width: 50,
        render: (text) => <p>{JSON.parse(text).r4}</p>,
      },
    ],
  },

  {
    title: 'Skin Integrity Checked',
    key: '_id',
    dataIndex: 'formVals',
    // width: 50,
    render: (text) => <p>{JSON.parse(text).r5}</p>,
  },
  {
    title: 'Type of Restraints',
    key: '_id',
    dataIndex: 'formVals',
    // width: 50,
    render: (text) => <p>{JSON.parse(text)['r-restraints-type']}</p>,
  },
  {
    title: 'Remarks',
    key: '_id',
    dataIndex: 'formVals',
    // width: 50,
    render: (text) => <p>{JSON.parse(text)['r-remarks']}</p>,
  },
  {
    title: 'Staff',
    key: '_id',
    dataIndex: 'staff',
    // width: 50,
  },
  {
    title: 'Submitted D/T',
    key: '_id',
    dataIndex: 'creationDate',
    // width: 50,
    render: (text) => <p>{moment(text).format('MMMM Do YYYY, h:mm:ss a')}</p>,
    // fixed: "right",
    // width: 100,
  },
];
