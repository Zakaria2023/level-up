
interface Props {
  children?: React.ReactNode
}

const ServerError = ({ children }: Props) => {
  return (
    <p
      role="alert"
      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm font-semibold text-red-400"
    >
      {children ?? "Something went wrong. Please try again later."}
    </p>
  );
}

export default ServerError;
