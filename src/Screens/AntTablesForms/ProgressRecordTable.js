import moment from "moment-timezone";
 export const progressRecordColumns = [
    {
      title: "Date",
      key: "_id",
      dataIndex: "formVals",
      fixed: "left",
      width: 100,
      render: (text) => <p>{JSON.parse(text).date}</p>,
    },
    {
      title: "Time",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).time}</p>,
    },
    {
      title: "General Condition",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).p1}</p>,
    },
    {
      title: "Mental State",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).p2}</p>,
    },
    {
      title: "Skin Care",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).p3}</p>,
    },
    {
      title: "Hygiene/Bathing",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).p4}</p>,
    },
    {
      title: "Oral Care",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).p5}</p>,
    },
    {
      title: "Feeding",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).p6}</p>,
    },
    {
      title: "Bladder",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).p7}</p>,
    },
    {
      title: "Bowel",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).p8}</p>,
    },
    {
      title: "Mobility",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).p9}</p>,
    },
    {
      title: "Rest at Night",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).p10}</p>,
    },
    {
      title: "Therapy",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).p11}</p>,
    },
    {
      title: "Visited",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).p12}</p>,
    },
    {
      title: "Remarks",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text)["r-remarks"]}</p>,
    },
    {
      title: "Staff",
      key: "_id",
      dataIndex: "staff",
    },
    {
      title: "Submitted D/T",
      key: "_id",
      dataIndex: "creationDate",
      render: (text) => <p>{moment(text).format("MMMM Do YYYY, h:mm:ss a")}</p>,
      fixed: "right",
      width: 100,
    },
  ];
