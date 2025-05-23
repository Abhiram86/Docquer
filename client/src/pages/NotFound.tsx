import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function NotFound() {
  const router = useNavigate();
  return (
    <section className="p-4">
      <div className="text-xl font-medium text-center text-balance">
        <img
          className="mx-auto w-80"
          src="assets/notfound.png"
          alt="not found"
        />
        <h1 className="text-zinc-300">
          Ummm... the page you are looking for does not exist
        </h1>
      </div>
      <div className="w-fit mx-auto mt-6">
        <Button text="Take me to home" onClick={() => router("/")} />
      </div>
    </section>
  );
}
