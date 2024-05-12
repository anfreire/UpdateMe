import { Image } from "@nextui-org/react";

export interface AdblockListItemProps {
  step: string | React.ReactNode;
  src?: string;
  child?: React.ReactNode;
}

export default function AdblockListItem({
  step,
  src,
  child,
}: AdblockListItemProps) {
  return (
    <li className="mt-4 flex flex-col items-center justify-center gap-4 p-4 py-8 md:mt-8 xl:mt-16">
      <div className="text-center text-lg">{step}</div>
      {src && <Image src={src}></Image>}
      {child}
    </li>
  );
}
