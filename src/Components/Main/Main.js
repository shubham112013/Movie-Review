import { useState } from "react";
import ListBox from "./Box";
import WatchedBox from "./WatchedBox";

export default function Main({ average, children }) {
  return (
    <main className="main">
      {children}
      {/* <WatchedBox average={average} /> */}
    </main>
  );
}
