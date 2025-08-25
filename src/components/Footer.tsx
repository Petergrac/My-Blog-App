import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-gradient-to-b to-slate-900 from-slate-300">
      <div className="flex items-center justify-center flex-col py-10 gap-8">
        <h1 className="text-2xl font-bold font-lora text-white/75">
          Stay in Touch
        </h1>
        <div className="flex items-center bg-zinc-200 w-fit">
          <input placeholder="Enter your email address" type="text" className="text-black placeholder:text-zinc-500 text-sm bg-transparent pl-1 outline-none" />
          <button
            type="submit"
            className="bg-slate-500 hover:bg-slate-600 px-2 py-2 text-sm text-slate-200 font-bold"
          >
            Submit
          </button>
        </div>
      </div>
      <div className="flex justify-around py-8 text-gray-300 bg-slate-700 backdrop-blur-sm">
        <h1 className="font-lora text-2xl">Bloog.</h1>
        <div className="flex gap-4">
          <Link href="/">HOME</Link>
          <Link href="/about">ABOUT</Link>
          <Link href="/contact">CONTACTS</Link>
          <Link href="/categories">CATEGORIES</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
