import Search from "./Search";
import Logo from "./Logo";
import NumResults from "./NumResults";

export default function NavBar({ children, setQuery }) {
  return (
    <nav className="nav-bar">
      {" "}
      <Logo setQuery={setQuery} />
      {children}
    </nav>
  );
}
