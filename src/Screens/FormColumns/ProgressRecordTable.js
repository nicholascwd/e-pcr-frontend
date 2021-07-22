import moment from 'moment-timezone';
export const progressRecordColumns = [
  {
    text: 'Date',
    key: '_id',
    dataField: 'formVals',
    // fixed: 'left',
    // width: 100,
    formatter: (text) => <p>{JSON.parse(text).date}</p>,
  },
  {
    text: 'Time',
    key: '_id',
    dataField: 'formVals',
    formatter: (text) => <p>{JSON.parse(text).time}</p>,
  },
  {
    text: 'General Condition',
    key: '_id',
    dataField: 'formVals',
    formatter: (text) => <p>{JSON.parse(text).p1}</p>,
  },
  {
    text: 'Mental State',
    key: '_id',
    dataField: 'formVals',
    formatter: (text) => <p>{JSON.parse(text).p2}</p>,
  },
  {
    text: 'Skin Care',
    key: '_id',
    dataField: 'formVals',
    formatter: (text) => <p>{JSON.parse(text).p3}</p>,
  },
  {
    text: 'Hygiene/ Bathing',
    key: '_id',
    dataField: 'formVals',
    formatter: (text) => <p>{JSON.parse(text).p4}</p>,
  },
  {
    text: 'Oral Care',
    key: '_id',
    dataField: 'formVals',
    formatter: (text) => <p>{JSON.parse(text).p5}</p>,
  },
  {
    text: 'Feeding',
    key: '_id',
    dataField: 'formVals',
    formatter: (text) => <p>{JSON.parse(text).p6}</p>,
  },
  {
    text: 'Bladder',
    key: '_id',
    dataField: 'formVals',
    formatter: (text) => <p>{JSON.parse(text).p7}</p>,
  },
  {
    text: 'Bowel',
    key: '_id',
    dataField: 'formVals',
    formatter: (text) => <p>{JSON.parse(text).p8}</p>,
  },
  {
    text: 'Mobility',
    key: '_id',
    dataField: 'formVals',
    formatter: (text) => <p>{JSON.parse(text).p9}</p>,
  },
  {
    text: 'Rest at Night',
    key: '_id',
    dataField: 'formVals',
    formatter: (text) => <p>{JSON.parse(text).p10}</p>,
  },
  {
    text: 'Therapy',
    key: '_id',
    dataField: 'formVals',
    formatter: (text) => <p>{JSON.parse(text).p11}</p>,
  },
  {
    text: 'Visited',
    key: '_id',
    dataField: 'formVals',
    formatter: (text) => <p>{JSON.parse(text).p12}</p>,
  },
  {
    text: 'Remarks',
    key: '_id',
    dataField: 'formVals',
    formatter: (text) => <p>{JSON.parse(text)['r-remarks']}</p>,
  },
  {
    text: 'Staff',
    key: '_id',
    dataField: 'staff',
  },
  {
    text: 'Submitted D/T',
    key: '_id',
    dataField: 'creationDate',
    formatter: (text) => (
      <p>{moment(text).format('MMMM Do YYYY, h:mm:ss a')}</p>
    ),
    // fixed: 'right',
    // width: 100,
  },
];
