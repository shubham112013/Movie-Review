export default function WatchedSummary({ watched = [], average }) {
  // Check if watched array has any movies; if not, set default average values to 0
  const avgImdbRating =
    watched?.length > 0
      ? average(watched.map((movie) => movie.imdbRating || 0))
      : 0;
  const avgUserRating =
    watched?.length > 0
      ? average(watched.map((movie) => movie.userRating || 0))
      : 0;
  const avgRuntime =
    watched?.length > 0
      ? average(watched.map((movie) => movie.runtime || 0))
      : 0;

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(0)} min</span>
        </p>
      </div>
    </div>
  );
}
