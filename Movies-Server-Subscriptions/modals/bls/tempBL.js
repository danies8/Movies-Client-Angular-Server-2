const membersDal = require('../../dals/membersDal');
const moviesDal = require('../../dals/moviesDal');
const membersBL = require('./membersBL');
const moviesBL = require('./moviesBL');

exports.insertSubscriptionWebServiceDataToDB = async function () {
    let membersResp = await membersDal.getMembers();
    let members = membersResp.data;

    members.forEach(async (member, key) => {
        await membersBL.addMember({name:member.name, email:member.email, city:member.address.city })
    });

   let moviesResp = await moviesDal.getMovies();
   let movies = moviesResp.data;
   movies.forEach(async (movie, key) => {
       await moviesBL.addMovie({name:movie.name, genres:movie.genres, image:movie.image.original, premiered:movie.premiered })
   });
}
