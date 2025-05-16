import Link from "next/link";

type VideoCardProps = {
  href: string;
  title: string;
  description: string;
  categorys: string[];
  views: string;
  date: string;
  thumbnail: string;
};

export function VideoCard({
  href,
  title,
  description,
  categorys,
  views,
  date,
  thumbnail,
}: VideoCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 w-full p-3 rounded-2xl border-slate-300  bg-slate-100 hover:bg-slate-200 duration-200 ease-out"
    >
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-48 object-cover bg-slate-300 rounded-xl"
      />
      <div className="flex flex-col gap-2 p-1">
        <h1
          title={title}
          className="leading-tight select-none text-xl font-semibold line-clamp-1"
        >
          {title}
        </h1>
        <p
          title={description}
          className="line-clamp-2 select-none text-slate-600"
        >
          {description}
        </p>
      </div>
      <div className="flex items-center justify-between w-full p-1">
        <span className="text-base text-slate-500">{views} views</span>
        <div className="flex items-center justify-end gap-1">
          {categorys.map((category) => (
            <span
              key={category}
              className="h-7 text-sm border border-slate-300 rounded-full px-3 flex items-center justify-center text-slate-700"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
