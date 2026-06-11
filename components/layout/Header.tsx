export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="text-2xl font-bold text-blue-900">Nexora</div>

        <nav className="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#">Business</a>
          <a href="#">Countries</a>
          <a href="#">Rates</a>
          <a href="#">FAQ</a>
        </nav>

        <button className="rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white">
          Create Request
        </button>
      </div>
    </header>
  );
}