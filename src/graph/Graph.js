import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { format } from "date-fns";

const Graph = ({ data }) => {
  const renderCustomAxisTick = ({ data }) => {
    return data?.map((item) => format(item.date.local, "yyyy-MM-dd"));
  };

  const keyName = Object.keys(data[0].date)[1];

  return (
    <>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={keyName} tickFormatter={renderCustomAxisTick} />
        <YAxis />
        <Tooltip />

        <Line type="monotone" dataKey="value" stroke="#FFBE50" />
      </LineChart>
    </>
  );
};

export default Graph;
