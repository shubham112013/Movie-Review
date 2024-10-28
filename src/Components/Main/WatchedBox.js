// import { useState } from "react";
// import WatchedSummary from "./WatchedSummary";
// import WatchedList from "./WatchedList";

// export default function WatchedBox({ average }) {
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} average={average} />
//           <WatchedList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }
