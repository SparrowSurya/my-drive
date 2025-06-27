export type LoadingProps = {
  text?: string,
};

export default function Loading({ text }: Readonly<LoadingProps>) {
  return (
    <div className="text-center text-lavender size-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-lg">{ text ?? "Loading ..."}</p>
    </div>
  );
}