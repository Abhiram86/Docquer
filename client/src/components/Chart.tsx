import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   { timestamp: "2022-09-20 10:27:21.240752", messageCount: 400 },
//   { timestamp: "2022-09-21 11:00:12.123456", messageCount: 350 },
//   { timestamp: "2022-09-22 09:35:48.654321", messageCount: 300 },
//   { timestamp: "2022-09-23 13:40:05.987654", messageCount: 450 },
//   { timestamp: "2022-09-24 15:05:32.456789", messageCount: 500 },
//   { timestamp: "2022-09-25 16:22:47.345678", messageCount: 600 },
//   { timestamp: "2022-09-26 17:55:19.123456", messageCount: 550 },
// ];

const formattedData = (
  data: {
    timestamp: string;
    messageCount: number;
  }[]
) => {
  return data.map((d) => ({
    ...d,
    date: new Date(d.timestamp),
  }));
};

const format = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${month < 10 ? `0${month}` : month}/${day < 10 ? `0${day}` : day} ${
    hours < 10 ? `0${hours}` : hours
  }:${minutes < 10 ? `0${minutes}` : minutes}`;
};

const Linechart = ({
  data,
}: {
  data: {
    timestamp: string;
    messageCount: number;
  }[];
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={formattedData(data)}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(timestamp) => format(new Date(timestamp))}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(timestamp) => format(new Date(timestamp))}
          contentStyle={{
            backgroundColor: "rgba(9, 11, 11, 0.25)",
            borderRadius: "5px",
            borderColor: "#52525b",
            backdropFilter: "blur(1.5px)",
          }}
        />
        <Line
          type="monotone"
          dataKey="messageCount"
          stroke="#a855f7"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
export default Linechart;
