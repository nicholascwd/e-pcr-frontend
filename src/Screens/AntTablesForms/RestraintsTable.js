import moment from "moment-timezone";
export const restraintsColumns = [
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
      title: "Applied Correctly",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).r1}</p>,
    },
    {
      title: "Comfortable",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).r2}</p>,
    },
    {
      title: "Circulation",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).r3}</p>,
    },
    {
      title: "ROM",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).r4}</p>,
    },
    {
      title: "Skin Checked",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text).r5}</p>,
    },
    {
      title: "Type of Restraints",
      key: "_id",
      dataIndex: "formVals",
      render: (text) => <p>{JSON.parse(text)["r-restraints-type"]}</p>,
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
