import { useContext, useEffect, useState } from "react";
import Linechart from "./Chart";
import { ThemeContext } from "../context/ThemeProvider";
import { get_conv_details } from "../api/llm";
// import Areachart from "./Chart";

type Data = {
  conv_data: {
    timestamp: string;
    messageCount: number;
  }[];
  totalMessages: number;
  totalFiles: number;
};

export default function ProfileBento() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("ThemeContext not found");
  }
  const { user } = context;
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    const handleData = async () => {
      if (user) {
        const res = await get_conv_details(user.convos || []);
        if (res.status === 200) {
          setData(res.data);
        }
      }
    };
    handleData();
  }, [user]);
  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="flex-1 space-y-1 p-4 border-2 overflow-clip border-zinc-700 rounded-lg text-balance">
          <h1 className="font-semibold">Total Conversations</h1>
          <p className="text-yellow-400 bg-pur">{user?.convos?.length}</p>
        </div>
        <div className="flex-1 space-y-1 p-4 border-2 border-zinc-700 rounded-lg text-balance">
          <h1 className="font-semibold">Total Files Uploaded</h1>
          <p className="text-blue-400">{data ? data.totalFiles : 0}</p>
        </div>
        <div className="flex-1 space-y-1 p-4 border-2 border-zinc-700 rounded-lg text-balance">
          <h1 className="font-semibold">Total Messages</h1>
          <p className="text-emerald-500">{data ? data.totalMessages : 0}</p>
        </div>
      </div>
      <div className="py-6 px-2 border-2 border-zinc-700 rounded-lg">
        <h1 className="font-semibold mb-4 pl-7">Your Conversations</h1>
        {data && data.conv_data && data.conv_data.length > 0 && (
          <Linechart data={data.conv_data} />
        )}
      </div>
    </div>
  );
}
