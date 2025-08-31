import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-gradient-to-b to-slate-900 from-slate-300">
      <h1 className="text-2xl font-bold text-center py-5 font-lora text-white/75">
        Stay in Touch
      </h1>
      <div className="flex justify-around py-8 text-gray-300 bg-slate-700 backdrop-blur-sm">
        <h1 className="font-lora text-2xl">Bloog.</h1>
        <div className="flex gap-4">
          <Link href="/">HOME</Link>
          <Link href="/about">ABOUT</Link>
          <Link href="/contact">CONTACTS</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
