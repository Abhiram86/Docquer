import { useNavigate } from "react-router-dom";
import Bento from "../components/Bento";
import Button from "../components/Button";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";

export default function Home() {
  const router = useNavigate();
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("ThemeContext not found");
  }
  const { user } = context;
  return (
    <section className="p-2 mb-4 w-full top-0 sticky">
      <div className="text-center text-balance grad-text text-2xl tracking-wider font-medium">
        <h1 className="font-extrabold">
          Feed The <span className="text-violet-400 font">Data</span> And Learn
          The <span className="text-violet-400">Data</span>
        </h1>
      </div>
      <div className="relative w-fit mx-auto overflow-clip">
        <video
          className="absolute blur-[54px] border top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          max-w-[30rem]"
          loop
          autoPlay
          muted
        >
          <source src="../src/assets/video/motion.mp4" type="video/mp4" />
        </video>
        <Bento />
      </div>
      <div className="flex max-w-[48rem] w-full px-4 mt-4 mx-auto sm:flex-row gap-2 flex-col">
        <Button
          text="Get Started"
          color1="bg-purple-700"
          color2="bg-zinc-800"
          textColor1="text-white"
          onClick={() => {
            if (user) {
              router("/chat/new");
            } else {
              router("/auth?mode=signup");
            }
          }}
        />
        {user ? (
          <Button
            text="Contact"
            color1="bg-white"
            color2="bg-zinc-800"
            textColor1="text-black"
            onClick={() => router("/contact")}
          />
        ) : (
          <Button
            text="Login"
            color1="bg-white"
            color2="bg-zinc-800"
            textColor1="text-black"
            onClick={() => router("/auth?mode=login")}
          />
        )}
      </div>
    </section>
  );
}
