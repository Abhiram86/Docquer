import { useLocation, useNavigate } from "react-router-dom";
import { links } from "../constants/links";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const router = useNavigate();

  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("ThemeContext not found");
  }

  const { user } = context;

  return (
    <header className="p-2 hidden sm:block select-none bg-black/25 border-b border-zinc-400 backdrop-blur-sm top-0 sticky z-50">
      <nav className="flex flex-row items-center">
        <div className="w-16">
          <img
            src="../src/assets/logo/logo_b.png"
            className="md:block hidden cursor-pointer"
            alt="logo"
            onClick={() => router("/")}
          />
          <img
            src="../src/assets/logo/logo_s.png"
            className="md:hidden cursor-pointer"
            alt="logo"
            onClick={() => router("/")}
          />
        </div>
        <ul className="flex text-zinc-400 flex-row flex-1 justify-evenly">
          {links.map((link) => (
            <li
              key={link.path}
              className={`tracking-widest cursor-pointer font-medium ${
                path === link.path
                  ? "text-purple-400"
                  : "hover:text-purple-200 hover:blur-[0.75px]"
              }`}
              onClick={() => router(link.path)}
            >
              <p>{link.name}</p>
            </li>
          ))}
          {user === null ? (
            <li
              className={`tracking-widest cursor-pointer font-medium ${
                path === "/auth"
                  ? "text-purple-400"
                  : "hover:text-purple-200 hover:blur-[0.75px]"
              }`}
              onClick={() => router("/auth")}
            >
              <p>Register</p>
            </li>
          ) : (
            <>
              <li
                className={`tracking-widest cursor-pointer font-medium ${
                  path === "/chats"
                    ? "text-purple-400"
                    : "hover:text-purple-200 hover:blur-[0.75px]"
                }`}
                onClick={() => router("/chats")}
              >
                <p>Chats</p>
              </li>
              <li
                className={`tracking-widest cursor-pointer font-medium ${
                  path === "/profile"
                    ? "text-purple-400"
                    : "hover:text-purple-200 hover:blur-[0.75px]"
                }`}
                onClick={() => router("/profile")}
              >
                <p>Profile</p>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
