import Image from "next/image";
import Link from "next/link";

const MostRecent = () => {
  return (
    <Link href='/blog/id' className="anim mx-auto border-[1px] rounded-sm  overflow-hidden  w-52 px-2 shadow-md">
    {/* BADGE */}
    <div className="relative">
        <p className="absolute top-2 left-1 text-gray-200 bg-fuchsia-600 px-1 text-xs">JavaScript</p>
          <Image src="/hero/home.jpg" className="hover:scale-120 duration-500" alt="home" width={200} height={100} />
    </div>
      {/* TITLE & CONTENT */}
      <div className="flex flex-col justify-between pb-2 border-b-[1px]">
        {/* TITLE */}
        <h1 className="font-lora text-sm font-semibold py-3">Still Standing Tall</h1>
        {/* CONTENT */}
        <p className="text-xs overflow-hidden h-5 ">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptate,
          placeat! Fuga doloribus ea facilis at ex fugiat animi obcaecati qui
          provident, tenetur vitae consequuntur cumque quasi inventore placeat
          nostrum nemo!
        </p>
      </div>
      {/* AUTHOR AND DATE */}
      <div className="flex justify-between py-3 items-center">
        {/* AUTHOR */}
        <div className="flex gap-2 items-center">
          <Image
            src="/hero/home.jpg"
            alt="home"
            width={24}
            className="rounded-full aspect-square"
            height={24}
          />
          <p className="text-xs">William Feng</p>
        </div>
        {/* DATE */}
        <p className="text-xs">
          8/25/2025
        </p>
      </div>
    </Link>
  );
};

export default MostRecent;
