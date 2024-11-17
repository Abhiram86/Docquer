export default function Bento() {
  return (
    <div className="flex flex-col tracking-tighter px-4 w-full max-w-[48rem] gap-2">
      <div className="grid grid-cols-5 mt-8 gap-2 overflow-x-auto">
        <div className="col-span-2 sm:col-span-3 relative rounded-2xl border-2 flex flex-col items-center justify-center border-zinc-400/25 p-2 space-y-2 text-balance bg-zinc-900/50 backdrop-blur-sm">
          <h1 className="text-2xl top-10 text-zinc-200 font-semibold">
            Any Kind!
          </h1>
          <div className="logos-container sm:mt-0 flex flex-row gap-2 justify-center items-center">
            <div className="logos flex flex-row w-fit mx-auto mt-2 items-center">
              <img
                src="../src/assets/pdf.png"
                className="h-16 aspect-auto"
                alt="pdf"
              />
              <img src="../src/assets/docx.png" className="h-14" alt="pdf" />
            </div>
            <div className="logos flex flex-row items-center gap-2 sm:gap-3 fit mx-auto">
              <img src="../src/assets/csv.svg" className="h-12" alt="pdf" />
              <img src="../src/assets/ppt.png" className="h-14" alt="pdf" />
            </div>
          </div>
          <p className="p-4 sm:p-4 border-2 rounded-lg text-zinc-400 border-zinc-800 font-semibold text-center w-[12ch] sm:w-[26ch]">
            And further formats are on the way!
          </p>
        </div>
        <div className="col-span-3 sm:col-span-2 grid grid-rows-2 gap-2">
          <div className="rounded-2xl border-2 space-y-2 border-zinc-400/25 p-2 text-balance bg-zinc-900/50 backdrop-blur-sm">
            <h1 className="text-2xl text-zinc-200 font-semibold">
              Upload with a single click
            </h1>
            <img
              className="rounded-lg"
              src="../src/assets/im1.png"
              alt="pic1"
            />
          </div>
          <div className="rounded-2xl border-2 space-y-2 border-zinc-400/25 p-2 text-balance bg-zinc-900/50 backdrop-blur-sm">
            <h2 className="text-2xl text-zinc-200 font-semibold">
              Easily manage Conversations
            </h2>
            <img
              className="rounded-lg"
              src="../src/assets/im2.png"
              alt="pic2"
            />
          </div>
        </div>
      </div>
      {/* <div className="p-2 text-balance rounded-xl bg-zinc-900/50 backdrop-blur-sm border-2 border-zinc-800">
        <h1 className="text-2xl font-semibold space-y-2">
          Track your conversations and files in one place
        </h1>
        <p>
          Easily manage your conversations and files in one place. Keep track of
          your conversations and files in one place.
        </p>
      </div> */}
    </div>
  );
}
