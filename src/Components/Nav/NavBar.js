import Logo from "./Logo";

export default function NavBar({ children, setQuery }) {
  return (
    <nav className="nav-bar">
      {" "}
      <Logo setQuery={setQuery} />
      {children}
    </nav>
  );
}
