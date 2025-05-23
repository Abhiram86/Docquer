export default function Contact() {
  return (
    <section className="px-12 py-2 md:mt-2 space-y-4">
      <div className="text-balance">
        <h1 className="text-2xl font-semibold mb-1">Author</h1>
        <div>
          <h2 className="font-medium tracking-wide text-zinc-200">
            -{">"} About myself
          </h2>
          <p className="font-medium tracking-wide text-zinc-400">
            -{">"}-{">"} I'm{" "}
            <span className="text-yellow-400 cursor-pointer font-semibold">
              Abhiram Alla
            </span>
            , currently a second year student
          </p>
          <p className="font-medium tracking-wide text-zinc-400">
            -{">"}-{">"} I'm just a student trying to learn things i love
          </p>
          <p className="font-medium tracking-wide text-zinc-400">
            -{">"}-{">"} Also I'm a self-taught developer
          </p>
        </div>
        <div>
          <h2 className="font-medium tracking-wide text-zinc-200">
            -{">"} About other projects
          </h2>
          <p className="font-medium tracking-wide text-zinc-400">
            -{">"}-{">"}{" "}
            <a
              href="#"
              className="text-purple-500 underline underline-offset-2 cursor-pointer font-semibold"
            >
              this one
            </a>
            , currently the latest
          </p>
          <p className="font-medium tracking-wide text-zinc-400">
            -{">"}-{">"}{" "}
            <a
              href="https://ani-search-one.vercel.app/"
              target="_blank"
              className="font-semibold text-purple-500 underline underline-offset-2"
            >
              Anilist
            </a>{" "}
            an anime tracker
          </p>
          <p className="font-medium tracking-wide text-zinc-400">
            -{">"}-{">"}{" "}
            <a
              href="https://github.com/Abhiram86/Nakama"
              target="_blank"
              className="font-semibold text-purple-700 underline underline-offset-2"
            >
              Nakama
            </a>{" "}
            the previous application i made
          </p>
        </div>
        <div>
          <h2 className="font-medium tracking-wide text-zinc-200">
            -{">"} About my specifications
          </h2>
          <p className="font-medium tracking-wide text-zinc-400">
            -{">"}-{">"} Know{" "}
            <span className="text-yellow-400">
              Mern, Next, TailwindCSS, Fastapi
            </span>
          </p>
          <p className="font-medium tracking-wide text-zinc-400">
            -{">"}-{">"} Know{" "}
            <span className="text-yellow-400">
              Langchain, OpenAI, Ollama, Pinecone, Chroma
            </span>
          </p>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-semibold mb-1">Socila Links</h1>
        <div className="flex flex-row gap-4">
          <img
            className="h-8 cursor-pointer invert"
            src="assets/github.svg"
            alt="github"
            onClick={() => window.open("https://github.com/Abhiram86")}
          />
          <img
            className="h-8 cursor-pointer"
            src="assets/linkedin.svg"
            alt="linkedin"
            onClick={() =>
              window.open("https://www.linkedin.com/in/abhiram-alla-0684512ab/")
            }
          />
          <img
            className="h-8 cursor-pointer invert"
            src="assets/twitter.svg"
            alt="X"
            onClick={() => window.open("https://x.com/alla_abhiram")}
          />
        </div>
      </div>
    </section>
  );
}
