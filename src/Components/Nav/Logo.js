import { useRef } from "react";

export default function Logo({ setQuery }) {
  const inputEl = useRef(null);

  function handleClick() {
    setQuery("");
    inputEl.current.focus();
  }

  return (
    <div className="logo" onClick={handleClick} ref={inputEl}>
      <span role="img">🍿</span>
      <h1>ReviewVault</h1>
    </div>
  );
}
