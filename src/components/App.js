import React from "react";
import MovieList from "./MovieList";
import SearchBar from "./SearchBar";
import AddMovie from "./AddMovie";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends React.Component {
  state = {
    movies: [],
    searchQuery: "",
  };

  async componentDidMount() {
    const response = await axios.get("http://localhost:3002/movies");
    this.setState({ movies: response.data });
  }

  deleteMovie = async (movie) => {
    axios.delete(`http://localhost:3002/movies/${movie.id}`);
    const movies = this.state.movies.filter((x) => x.id !== movie.id);
    this.setState({ movies: movies });
  };

  searchMovie = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  AddMovie = async (movie) => {
    await axios.post(`http://localhost:3002/movies/`, movie);
    this.setState((state) => ({
      movies: state.movies.concat([movie]),
    }));
  };

  render() {
    let filteredMovies = this.state.movies.filter((movie) => {
      return (
        movie.name
          .toLowerCase()
          .indexOf(this.state.searchQuery.toLowerCase()) !== -1
      );
    });

    return (
      <Router>
        <div className="container">
          <Switch>
            <Route
              path="/"
              exact
              render={() => (
                <>
                  <div className="row">
                    <div className="col-lg-12">
                      <SearchBar searchMovieProp={this.searchMovie} />
                    </div>
                  </div>
                  <MovieList
                    movies={filteredMovies}
                    deleteMovieProp={this.deleteMovie}
                  />
                </>
              )}
            ></Route>
            <Route
              path="/add"
              exact
              render={({ history }) => (
                <AddMovie
                  onAddMovie={(movie) => {
                    this.AddMovie(movie);
                    history.push("/");
                  }}
                />
              )}
            ></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
