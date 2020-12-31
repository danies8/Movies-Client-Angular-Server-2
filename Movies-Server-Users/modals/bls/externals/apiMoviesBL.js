const axios = require('axios');

const common = require('../../../Utils/common');


exports.getAllMoviesNames = async function () {
  try {

    let respMovies = await axios.get(common.moviesAddress);
    let respMoviesData = respMovies.data;
    if (respMoviesData.isSuccess) {
      let movies = respMoviesData.results;
      let moviesNames = movies.map(movie => movie.name);
      return { isSuccess: true, moviesNames: moviesNames };
    }
    else {
      return { isSuccess: false, errorMessage: "Failed to bring movies names" };
    }
  }

  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

exports.getAllMovies = async function () {
  try {
    let respMovies = await axios.get(common.moviesAddress);
    let respMoviesData = respMovies.data;
    if (respMoviesData.isSuccess) {
      let movies = respMoviesData.results;

      let respSubscriptions = await axios.get(common.subscriptionsAddress);
      let respSubscriptionsData = respSubscriptions.data;
      if (respSubscriptionsData.isSuccess) {
        let subscriptions = respSubscriptionsData.results;

        let respMembers = await axios.get(common.membersAddress);
        let respMembersData = respMembers.data;
        if (respMembersData.isSuccess) {
          let members = respMembersData.results;

          let moviesDataArr = [];
          movies.forEach((movie, index) => {

            let movieDataObj = {};
            movieDataObj.movieData = movie;

            let subscribedDataArray = [];
            subscriptions.forEach((subscriptionObj1, index) => {
              let subscribedDataObj = {};
              let subscribedMovies = subscriptionObj1.movies;

              subscribedMovies.forEach((subscribedMovie, index) => {
                if (subscribedMovie.movieId == movie._id) {

                  subscribedDataObj.date = subscribedMovie.date;

                  subscriptions.forEach((subscriptionObj2, index) => {
                    if (subscriptionObj2._id == subscriptionObj1._id) {
                      members.forEach((member, index) => {
                        if (member._id == subscriptionObj2.memberId) {
                          subscribedDataObj.memberData = member;
                        }
                      });
                      subscribedDataArray.push(subscribedDataObj);
                    }

                  });
                }
              });
            });
            movieDataObj.subscribedDataArray = subscribedDataArray;
            moviesDataArr.push(movieDataObj);
          });

          return { isSuccess: true, moviesDataArr: moviesDataArr };
        }
        else {
          return { isSuccess: false, errorMessage: "Failed to bring all members data" };
        }

      }
      else {
        return { isSuccess: false, errorMessage: "Failed to bring all subscriptions data" };
      }
    }
    else {
      return { isSuccess: false, errorMessage: "Failed to bring all movies data" };
    }

  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

exports.addMovie = async function (addMovie) {
  try {

    let respMovies = await axios.post(common.moviesAddress, addMovie);
    let respMoviesData = respMovies.data;
    if (respMoviesData.isSuccess) {
      return { isSuccess: true };
    }
    else {
      return { isSuccess: false, errorMessage: "Failed to add movie data" };
    }
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}


exports.deleteMovie = async function (movieId) {
  try {
      let respMovies = await axios.delete(common.moviesAddress + "/" + movieId);
      let respMoviesData = respMovies.data;
      if (respMoviesData.isSuccess) {
          let respSubscriptions = await axios.get(common.subscriptionsAddress);
          let respSubscriptionsData = respSubscriptions.data;
          if (respSubscriptionsData.isSuccess) {
              let subscriptions = respSubscriptionsData.results;
              let subscribedMovieToRemove = {};
              let subscribedUidToRemove;
              subscriptions.forEach((subscription, index) => {
                  subscription.movies.forEach(async (subscribedMovie, index) => {
                      if (subscribedMovie.movieId === movieId) {
                          subscribedMovieToRemove = subscribedMovie;
                          subscribedUidToRemove = subscription._id;

                          let filteredSubscription = subscriptions.filter(subscription => subscription._id == subscribedUidToRemove);
                          if (filteredSubscription.length > 0) {
                              let index = filteredSubscription[0].movies.findIndex(movie => movie.movieId == movieId);
                              if (index > -1) {
                                  filteredSubscription[0].movies.splice(index, 1);
                                  let respUpdateMovies = await axios.put(common.subscriptionsAddress + "/" + subscribedUidToRemove, filteredSubscription[0]);
                                  let respUpdateMoviesData = respUpdateMovies.data;
                                  if (!respUpdateMoviesData.isSuccess) {
                                      return { isSuccess: false, errorMessage: "Failed to delete movie's subscriptions data" };
                                  }
                              }
                          }
                      }
                  });
              });

              return { isSuccess: true };
          }

          else {
              return { isSuccess: false, errorMessage: "Failed to get subscriptions data" };
          }
      }
      else {
          return { isSuccess: false, errorMessage: "Failed to delete movie data" };
      }
  }

  catch (e) {
      return { isSuccess: false, errorMessage: e.message };
  }
}


exports.getMovieById = async function (movieId) {
  try {

    let respMovies = await axios.get(common.moviesAddress + "/" + movieId);
    let respMoviesData = respMovies.data;
    if (respMoviesData.isSuccess) {
      let movie = respMoviesData.results;
      return { isSuccess: true, movie: movie };
    }
    else {
      return { isSuccess: false, errorMessage: "Failed to get the movie" };
    }


  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

exports.updateMovie = async function (movieId, editMovie) {
  try {
    let respMovies = await axios.put(common.moviesAddress + "/" + movieId, editMovie);
    let respMoviesData = respMovies.data;
    if (respMoviesData.isSuccess) {
      return { isSuccess: true };
    }
    else {
      return { isSuccess: false, errorMessage: "Failed to save member data" };
    }
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}


exports.getAllMoviesFilterByMovieName = async function (movieName, isExactFilter) {
  try {
    let moviesDataArr = [];
    let filterdMovies = [];
    let respMovies = await axios.get(common.moviesAddress);
    let respMoviesData = respMovies.data;
    if (isExactFilter) {
      if (respMoviesData.isSuccess) {
        let movies1 = respMoviesData.results;
        filterdMovies = movies1.filter(movie => movie.name == movieName);
      }
      else {
        return { isSuccess: false, errorMessage: "Failed to bring movie Data" };
      }
    }
    else {
      if (respMoviesData.isSuccess) {
        let movies2 = respMoviesData.results;
        filterdMovies = movies2.filter(movie => movie.name.trim().toLowerCase().includes(movieName.trim().toLowerCase()));
      }
      else {
        return { isSuccess: false, errorMessage: "Failed to bring filter movie Data" };
      }
    }

    if (filterdMovies.length == 0) {
      return { isSuccess: true, moviesDataArr: moviesDataArr };
    }

    let subscriptions = [];
    let respSubscriptions = await axios.get(common.subscriptionsAddress);
    let respSubscriptionsData = respSubscriptions.data;
    if (respSubscriptionsData.isSuccess) {
      subscriptions = respSubscriptionsData.results;
    }
    else {
      return { isSuccess: false, errorMessage: "Failed to bring movie's subscriptions Data" };
    }

    let members = [];
    let respMembers = await axios.get(common.membersAddress);
    let respMembersData = respMembers.data;
    if (respMembersData.isSuccess) {
      members = respMembersData.results;
    }
    else {
      return { isSuccess: false, errorMessage: "Failed to bring movie's members Data" };
    }


    filterdMovies.forEach((filterdMovie, index) => {

      let movieDataObj = {};
      movieDataObj.movieData = filterdMovie;

      let subscribedDataArray = [];
      subscriptions.forEach((subscriptionObj1, index) => {
        let subscribedDataObj = {};
        let subscribedMovies = subscriptionObj1.movies;

        subscribedMovies.forEach((subscribedMovie, index) => {
          if (subscribedMovie.movieId == filterdMovie._id) {

            subscribedDataObj.date = subscribedMovie.date;

            subscriptions.forEach((subscriptionObj2, index) => {
              if (subscriptionObj2._id == subscriptionObj1._id) {
                members.forEach((member, index) => {
                  if (member._id == subscriptionObj2.memberId) {
                    subscribedDataObj.memberData = member;
                  }
                });
                subscribedDataArray.push(subscribedDataObj);
              }

            });
          }
        });
      });
      movieDataObj.subscribedDataArray = subscribedDataArray;
      moviesDataArr.push(movieDataObj);
    });
    return { isSuccess: true, moviesDataArr: moviesDataArr };
  }

  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

