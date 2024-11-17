export default function Modal({
  children,
  className,
  title,
  subTitle,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
  subTitle?: string;
}) {
  return (
    <div className="fixed w-[calc(100vw-0rem)] z-50 h-[calc(100vh-9.25rem)] bg-black/75 flex top-1/2 left-1/2 max-w-[995px] -translate-x-1/2 -translate-y-1/2 justify-center items-center">
      <div className={`p-4 border-2 space-y-2 rounded-lg ${className}`}>
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-zinc-400 font-medium">{subTitle}</p>
        </div>
        <div className="flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
}
