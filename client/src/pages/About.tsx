export default function About() {
  return (
    <section className="px-12 mb-2 py-2 md:mt-2 flex flex-col gap-2">
      <div>
        <h1 className="text-2xl font-semibold">About the app</h1>
        <ol className="list-decimal pl-4">
          <li className="font-medium tracking-wide text-zinc-400">
            This is a simple rag(retrieval augmentation generator) system
          </li>
          <li className="font-medium tracking-wide text-zinc-400">
            powered by llama3 and Groq
          </li>
        </ol>
      </div>
      <div>
        <h1 className="text-2xl font-semibold">To whom this app?</h1>
        <h2 className="font-medium tracking-wide text-zinc-400">Everyone!</h2>
      </div>
      <div>
        <h1 className="text-2xl font-semibold">Why this created?</h1>
        <h2 className="font-medium tracking-wide text-zinc-400">
          Just to learn!
        </h2>
      </div>
      <div>
        <h1 className="text-2xl font-semibold">How to use?</h1>
        <ol className="list-decimal pl-4">
          <li className="font-medium tracking-wide text-zinc-400">
            Just upload your document
          </li>
          <li className="font-medium tracking-wide text-zinc-400">
            Query the model and get the result
          </li>
          <li className="font-medium tracking-wide text-zinc-400">
            That's it!
          </li>
        </ol>
      </div>
      <div>
        <h1 className="text-2xl font-semibold">Is it public?</h1>
        <ol className="list-decimal pl-4">
          <li className="font-medium tracking-wide text-zinc-400">
            Yes! It is public
          </li>
          <li className="font-medium tracking-wide text-zinc-400">
            <a
              href="http://docquer.com"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 text-blue-800"
            >
              here
            </a>{" "}
            is the link for the repo
          </li>
        </ol>
      </div>
      <div className="flex mt-2 max-w-[36rem] rounded-r-xl bg-yellow-950/80 gap-2">
        <div className="w-3 bg-yellow-400" />
        <div className="px-4 py-2">
          <p className="font-medium tracking-wide text-yellow-400">Note</p>
          <p className="tracking-wide text-zinc-200">
            Although it is nice to upload and learn it using from the app, it is
            best to read the source firs and then try to query the model to
            achieve best results :{")"}
          </p>
        </div>
      </div>
    </section>
  );
}
