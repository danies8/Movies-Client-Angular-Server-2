const axios = require('axios');

const common = require('../../../Utils/common');

exports.getAllMembersSubscriptionData = async function () {
  try {
    let membersDataArr = [];

    let respMembers = await axios.get(common.membersAddress);
    let respMembersData = respMembers.data;
    if (respMembersData.isSuccess) {
      let members = respMembersData.results;

      let respSubscriptions = await axios.get(common.subscriptionsAddress);
      let respSubscriptionsData = respSubscriptions.data;
      if (respSubscriptionsData.isSuccess) {
        let subscriptions = respSubscriptionsData.results;

        let respMovies = await axios.get(common.moviesAddress);
        let respMoviesData = respMovies.data;
        if (respMoviesData.isSuccess) {
          let movies = respMoviesData.results;

          members.forEach((member, index) => {
            let memberDataObj = {};
            memberDataObj.memberData = member;
            subscriptions.forEach((subscriptionData, index) => {
              if (subscriptionData.memberId == member._id) {
                let subscribedMoviesArr = [];
                let subscribedMovies = subscriptionData.movies;
                subscribedMovies.forEach((subscribedMovie, index) => {
                  let subscribedMovieObj = {};
                  subscribedMovieObj.id = subscribedMovie.movieId;
                  subscribedMovieObj.date = subscribedMovie.date;

                  movies.forEach((movieData, index) => {
                    if (movieData._id == subscribedMovie.movieId) {
                      subscribedMovieObj.name = movieData.name;
                      subscribedMoviesArr.push(subscribedMovieObj);
                    }
                  });
                  memberDataObj.moviesData = subscribedMoviesArr;
                });
              }
            });

            membersDataArr.push(memberDataObj);
          });

        }
        else {
          return { isSuccess: false, errorMessage: "Failed to bring member's moviess data" }
        }
      }
      else {
        return { isSuccess: false, errorMessage: "Failed to bring  member's subscriptions data" }
      }
    }
    else {
      return { isSuccess: false, errorMessage: "Failed to bring members data" }
    }


    return { isSuccess: true, membersDataArr: membersDataArr };

  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message }
  }
}



exports.addMember = async function (addMember) {

  try {
    let respMembers = await axios.post(common.membersAddress, addMember);
    let respMembersData = respMembers.data;
    if (respMembersData.isSuccess) {
      return { isSuccess: true };
    }
    else {
      return { isSuccess: false, errorMessage: "Failed to add member data" };
    }

  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}


exports.deleteMember = async function (memberId) {
  try {
    let respMembers = await axios.delete(common.membersAddress + "/" + memberId);
    let respMembersData = respMembers.data;
    if (respMembersData.isSuccess) {
      let respSubscriptions = await axios.get(common.subscriptionsAddress);
      let respSubscriptionsData = respSubscriptions.data;
      if (respSubscriptionsData.isSuccess) {
        let subscriptions = respSubscriptionsData.results;
        let subscriptionsFiltered = subscriptions.filter(subscription => subscription.memberId == memberId);
        if (subscriptionsFiltered.length > 0) {
          let respMembers = await axios.delete(common.subscriptionsAddress + "/" + subscriptionsFiltered[0]._id);
          let respMembersData = respMembers.data;
          if (respMembersData.isSuccess) {
            return { isSuccess: true };
          }
          else {
            return { isSuccess: false, errorMessage: "Failed to delete member's subscriptions data" };
          }
        }
        else {
          return { isSuccess: true };
        }
      }
      else {
        return { isSuccess: false, errorMessage: "Failed to get member's subscriptions data" };
      }
    }
    else {
      return { isSuccess: false, errorMessage: "Failed to delete member" };
    }

  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}


exports.getMemberById = async function (memberId) {
  try {
    let respMembers = await axios.get(common.membersAddress + "/" + memberId);
    let respMembersData = respMembers.data;
    if (respMembersData.isSuccess) {
      let member = respMembersData.results;
      return { isSuccess: true, member: member };
    }
    else {
      return { isSuccess: false, errorMessage: "Failed to get the member" };
    }
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}


exports.updateMember = async function (memberId, editMember) {
  try {
    let respMembers = await axios.put(common.membersAddress + "/" + memberId, editMember);
    let respMembersData = respMembers.data;
    if (respMembersData.isSuccess) {
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

exports.subscirbeToNewMovie = async function (subscirbeToNewMovieObj) {
  try {

    let newMovieDataObj = subscirbeToNewMovieObj.newMovieDataObj;
    let memberId = subscirbeToNewMovieObj.memberId;

    let respMovies = await axios.get(common.moviesAddress);
    let respMoviesData = respMovies.data;
    if (respMoviesData.isSuccess) {
      let movies = respMoviesData.results;
      let filterMovies = movies.filter(movie => movie.name == newMovieDataObj.name);
      let isMemberSubscribedResult = await isMemberSubscribed(memberId);
      if (filterMovies.length > 0 && !isMemberSubscribedResult) {
        let subscribtionObj = {};

        let subscribedMovieArr = [];
        let subscribedMovieObj = {};
        subscribedMovieObj.movieId = filterMovies[0]._id;
        subscribedMovieObj.date = newMovieDataObj.premiered;
        subscribedMovieArr.push(subscribedMovieObj);
        subscribtionObj.movies = subscribedMovieArr;
        let respAddSubscriptions = await axios.post(common.subscriptionsAddress, {
          memberId: memberId,
          movies: subscribtionObj.movies
        });
        let respAddSubscriptionsData = respAddSubscriptions.data;
        if (respAddSubscriptionsData.isSuccess) {
          return { isSuccess: true };
        }
        else {
          return { isSuccess: false, errorMessage: "Failed to add movie's subscription data" };
        }
      }
      else {
        let filterSubscriptionArr = [];
        let respSubscriptions = await axios.get(common.subscriptionsAddress);
        let respSubscriptionsData = respSubscriptions.data;
        if (respSubscriptionsData.isSuccess) {
          let subscriptions = respSubscriptionsData.results;
          let subscriptionsFiltered = subscriptions.filter(subscription => subscription.memberId == memberId);
          if (subscriptionsFiltered.length > 0) {

            let subscribedMovieObj1 = {};

            // current
            subscriptionsFiltered[0].movies.forEach((movie, index) => {
              subscribedMovieObj1.movieId = movie.movieId;
              subscribedMovieObj1.date = movie.date;
              filterSubscriptionArr.push(subscribedMovieObj1);
            });


            // new
            let subscribedMovieObj2 = {};
            subscribedMovieObj2.movieId = filterMovies[0]._id;
            subscribedMovieObj2.date = newMovieDataObj.premiered;
            filterSubscriptionArr.push(subscribedMovieObj2);

            let respUpdateSubscriptions =
              await axios.put(common.subscriptionsAddress + "/" + subscriptionsFiltered[0]._id,
                { memberId: memberId, movies: filterSubscriptionArr });
            let respUpdateSubscriptionsData = respUpdateSubscriptions.data;
            if (respUpdateSubscriptionsData.isSuccess) {
              return { isSuccess: true };
            }
            else {
              return { isSuccess: false, errorMessage: "Failed to add movie's subscription data" };
            }
          }
          else {
            return { isSuccess: false, errorMessage: "Failed to bring movies data" };
          }

        }
        else {
          return { isSuccess: false, errorMessage: "Failed to bring movie's subscription data" };
        }
      }
    }
    else {
      return { isSuccess: false, errorMessage: "Failed to bring movie data" };
    }

  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message };
  }
}

const isMemberSubscribed = async (memberId) => {

  let respSubscriptions = await axios.get(common.subscriptionsAddress);
  let respSubscriptionsData = respSubscriptions.data;
  if (respSubscriptionsData.isSuccess) {
    let subscriptions = respSubscriptionsData.results;
    let filtredSubscriptions = subscriptions.filter(subscription => subscription.memberId == memberId);
    if (filtredSubscriptions.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}


exports.getAllMembersSubscriptionDataFilterByMemberId = async function (memberId) {
  try {
    let respMembers = await axios.get(common.membersAddress + "/" + memberId);
    let respMembersData = respMembers.data;
    if (respMembersData.isSuccess) {
      let member = respMembersData.results;

      let respSubscriptions = await axios.get(common.subscriptionsAddress);
      let respSubscriptionsData = respSubscriptions.data;
      if (respSubscriptionsData.isSuccess) {
        let subscriptions = respSubscriptionsData.results;
        let filteredSubscriptions = subscriptions.filter(subscription => subscription.memberId == memberId);
        if (filteredSubscriptions.length > 0) {

          let respMovies = await axios.get(common.moviesAddress);
          let respMoviesData = respMovies.data;
          if (respMoviesData.isSuccess) {
            let movies = respMoviesData.results;

            let membersDataArr = [];
            let memberDataObj = {};
            memberDataObj.memberData = member;
            subscriptions.forEach((subscriptionData, index) => {
              if (subscriptionData.memberId == member._id) {
                let subscribedMoviesArr = [];
                let subscribedMovies = subscriptionData.movies;
                subscribedMovies.forEach((subscribedMovie, index) => {
                  let subscribedMovieObj = {};
                  subscribedMovieObj.id = subscribedMovie.movieId;
                  subscribedMovieObj.date = subscribedMovie.date;

                  movies.forEach((movieData, index) => {
                    if (movieData._id == subscribedMovie.movieId) {
                      subscribedMovieObj.name = movieData.name;
                      subscribedMoviesArr.push(subscribedMovieObj);
                    }
                  });
                  memberDataObj.moviesData = subscribedMoviesArr;
                });
              }
            });

            membersDataArr.push(memberDataObj);
            return { isSuccess: true, membersDataArr: membersDataArr };
          }
          else {
            return { isSuccess: false, errorMessage: "Failed to bring member's movies data" };
          }

        }
      }
      else {
        return { isSuccess: false, errorMessage: "Failed to bring member's subscription data" };
      }
    }
    else {
      return { isSuccess: false, errorMessage: "Failed to bring memeber data" };
    }
  }
  catch (e) {
    return { isSuccess: false, errorMessage: e.message }
  }
}