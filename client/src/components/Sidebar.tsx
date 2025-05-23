import { useLocation, useNavigate } from "react-router-dom";
import { links } from "../constants/links";
import { ThemeContext } from "../context/ThemeProvider";
import { useContext } from "react";

export function Header({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useNavigate();
  return (
    <header className="flex border-b border-zinc-400 sm:hidden justify-between p-2 z-50 top-0 sticky bg-black/50 backdrop-blur-md">
      <img
        src="assets/logo/logo_s.png"
        alt="logo"
        onClick={() => router("/")}
        className="w-16 cursor-pointer"
      />
      <img
        src="assets/panel.svg"
        alt="logo"
        onClick={() => setOpen(!open)}
        className="w-10 h-10 my-auto hover:bg-zinc-800 rounded-full p-[6px] cursor-pointer"
      />
    </header>
  );
}

export function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const location = useLocation();
  const path = location.pathname;
  const router = useNavigate();

  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("ThemeContext not found");
  }

  const { user } = context;
  return (
    <aside
      className={`flex flex-col sm:hidden fixed z-50 bg-black/50 backdrop-blur-sm border-2 rounded-lg border-zinc-700 mt-[73.34px] h-[calc(100vh-80px)] transition-all duration-500 ease-out ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <ul className="p-4">
        <h1 className="text-xl mb-2 font-semibold">Menubar</h1>
        <hr className="mb-2 border border-zinc-600" />
        <div className="flex flex-col gap-[2px]">
          {links.map((link) => (
            <li
              key={link.path}
              className={`font-medium pl-3 py-[2px] pr-16 rounded-md cursor-pointer transition-all duration-100 ${
                path === link.path
                  ? "bg-zinc-200 text-black"
                  : "hover:text-white text-zinc-400"
              }`}
              onClick={() => (router(link.path), setOpen(!open))}
            >
              <p>{link.name}</p>
            </li>
          ))}
          {user === null ? (
            <li
              className={`pl-3 pr-16 rounded-md py-[2px] transition-all cursor-pointer font-medium ${
                path === "/auth"
                  ? "bg-zinc-200 text-black"
                  : "hover:text-white text-zinc-400"
              }`}
              onClick={() => (router("/auth"), setOpen(!open))}
            >
              <p>Register</p>
            </li>
          ) : (
            <>
              <li
                className={`pl-3 pr-16 py-[2px] rounded-md cursor-pointer font-medium ${
                  path === "/chats"
                    ? "bg-zinc-200 text-black"
                    : "hover:text-white text-zinc-400"
                }`}
                onClick={() => (router("/chats"), setOpen(!open))}
              >
                <p>Chats</p>
              </li>
              <li
                className={`pl-3 pr-16 py-[2px] rounded-md cursor-pointer font-medium ${
                  path === "/profile"
                    ? "bg-zinc-200 text-black"
                    : "hover:text-white text-zinc-400"
                }`}
                onClick={() => (router("/profile"), setOpen(!open))}
              >
                <p>Profile</p>
              </li>
            </>
          )}
        </div>
      </ul>
    </aside>
  );
}
