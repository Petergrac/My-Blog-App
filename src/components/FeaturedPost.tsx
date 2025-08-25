import Image from "next/image";

const FeaturedPost = () => {
  return (
    <div className="border-[1px] p-[1px] relative aspect-video text-gray-200 px-4 w-80 flex flex-col anim rounded-sm bg-black/60 justify-around object-center h-60 mx-auto overflow-hidden">
      <Image src="/hero/contacts.jpg" alt="" className="absolute -z-10" fill />
      {/* BADGE */}
      <p className="bg-fuchsia-700  w-fit px-1 text-xs">
        JavaScript
      </p>
      <div>
        {/* TITLE */}
        <h1 className="text-2xl font-bold font-lora">The Road Ahead</h1>
        {/* CONTENT */}
        <p className="sm:text-sm text-xs font-sans h-10 py-2 overflow-hidden">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
          explicabo nobis numquam soluta vel, obcaecati error, dignissimos,
          earum laudantium possimus quidem a repellat? Earum vitae minus
          repellat consectetur ipsam reiciendis?
        </p>
        {/* AVATAR & DATE */}
        <div className="flex justify-between py-2">
          <div className="flex gap-2 items-center">
            <Image
              className="rounded-full object-fill aspect-square"
              src="/hero/about.jpg"
              width={24}
              height={24}
              alt="MV"
            />
            <p className="text-xs py-2">Mat Vogel</p>
          </div>
          <p className="text-xs py-2">
            August 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;
