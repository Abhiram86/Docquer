import { useNavigate } from "react-router-dom";
import ChatCard from "../components/ChatCard";
import { ThemeContext } from "../context/ThemeProvider";
import { useContext, useEffect, useState } from "react";
import { get_convos } from "../api/llm";

type Convos = {
  _id: string;
  title: string;
  username: string;
  subTitle: string;
  fileName: string;
  fileMime: string;
  firstMessage: string;
  messages: string[];
};

export default function Chats() {
  const router = useNavigate();
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("ThemeContext not found");
  }
  const { user } = context;
  const [convos, setConvos] = useState<Convos[]>([]);
  useEffect(() => {
    const handleConvos = async () => {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      if (!parsedUser) {
        router("/auth?mode=login");
        return;
      }
      if (user) {
        const res = await get_convos(user.convos || []);
        if (res.status === 200) {
          setConvos(res.data.convos);
          // const ids = res.data.convos.map((data) => data._id);
          // localStorage.setItem("user", JSON.stringify({ ...user, convos: ids }));
        }
      }
    };
    handleConvos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return (
    <section className="p-4">
      <h1 className="text-2xl text-center mb-5 font-semibold">
        Recent <strong className="text-violet-400">Chats</strong>
      </h1>
      <div className="w-fit mx-auto">
        <button
          className="bg-zinc-800 hover:bg-black transition-colors w-fit px-4 py-[0.5px] mb-2 rounded-full"
          onClick={() => router("/chat/new")}
        >
          create new
        </button>
      </div>
      <div className="flex flex-wrap justify-center items-start gap-2">
        {convos.map((data) => (
          <ChatCard
            onClick={() => router(`/chat/${data._id}`)}
            chartTitle={data.title}
            chartSubTitle={data.subTitle}
            fileName={data.fileName}
            firstMessage={data.firstMessage}
            conv_id={data._id}
            key={data._id}
          />
        ))}
      </div>
    </section>
  );
}
