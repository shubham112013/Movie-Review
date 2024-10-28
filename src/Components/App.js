import { useEffect, useState } from "react";
import NavBar from "./Nav/NavBar";
import Main from "./Main/Main";
import Search from "./Nav/Search";
import NumResults from "./Nav/NumResults";
import Box from "./Main/Box";
import MovieList from "./Main/MovieList";
import WatchedSummary from "./Main/WatchedSummary";
import WatchedList from "./Main/WatchedList";
import StarRating from "../StarRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "c57576a6";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState(() => {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });

  function handleSelectedMovie(id) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatchedMovie(movie) {
    setWatched((prev) => [...prev, movie]);
  }

  function handleDeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    console.log(watched);
  }

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovie() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          console.log(res, +"response");
          console.log(data.Search + "Search data");
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovie();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar movies={movies} setQuery={setQuery}>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? (
            <Loader />
          ) : (
            <MovieList movies={movies} average={average} />
          )}{" "} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              average={average}
              selectedMovie={handleSelectedMovie}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetail
              selectedId={selectedId}
              unSelectedMovie={handleCloseMovie}
              onAddWatched={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} average={average} />
              <WatchedList
                watched={watched}
                handleDelete={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading... </p>;
}

function MovieDetail({
  selectedId,
  unSelectedMovie,
  onAddWatched,
  watched,
  handleDelete,
}) {
  const [Movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState("");

  const isAlreadyWatched = watched
    .map((movie) => movie.imdbID)
    .includes(selectedId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    Plot: plot,
    Released: realeased,
    Actors: actors,
    Director: director,
    Genre: genre,
    imdbRating,
  } = Movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onAddWatched(newWatchedMovie);
    unSelectedMovie();
  }

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          unSelectedMovie();
        }
      }
      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keyword", callback);
      };
    },
    [unSelectedMovie]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn"; //This will run when the component is unmounted
      };
    },
    [title]
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        console.log(data);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={unSelectedMovie}>
          &larr;
        </button>
        <img src={poster} alt={`Poster of ${Movie} movie`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {realeased} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDb rating
          </p>
        </div>
      </header>

      <section>
        <div className="rating">
          {!isAlreadyWatched ? (
            <>
              <StarRating
                maxRating={10}
                size={25}
                setSelected={setUserRating}
              ></StarRating>
              {userRating && (
                <button className="btn-add" onClick={handleAdd}>
                  + Add Movie
                </button>
              )}
            </>
          ) : (
            <p>
              {" "}
              You have already rated this movie with {watchedUserRating} ⭐
            </p>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}
