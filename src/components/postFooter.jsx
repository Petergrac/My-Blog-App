// components/Footer.jsx

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-white/80 px-6 py-10 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-5">
        <div>
          <h2 className="text-xl font-bold text-blue-400">LinuxLabs</h2>
          <p className="text-sm">Where open-source meets code.</p>
        </div>

        <div className="flex gap-6 text-sm mt-4 md:mt-0">
          <a href="/home" className="hover:text-white">Home</a>
          <a href="/articles" className="hover:text-white">Articles</a>
          <a href="/about" className="hover:text-white">About</a>
          <a href="/contact" className="hover:text-white">Contact</a>
        </div>

        <div className="text-sm">
          <p>© {year} LinuxLabs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
