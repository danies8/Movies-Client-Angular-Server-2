
export interface MovieDataArr {
  movieData:MovieData,
}
export interface MovieData {
  genres:string[],
  _id:string,
  name:string,
  image:string,
  premired:string,
  subscribedDataArray:ISubscribedData[]
}
export interface ISubscribedData {
  date:string,
  memberData:IMemberData
}

export interface IMemberData {
  _id:string,
  name:string,
  email:string,
  city:string
}

export interface IMoviesResponse {
  moviesDataArr: MovieDataArr[],
  isSuccess: boolean,
  errorMessage: string
}


export interface IEditMovieData {
  _id:string,
  genres:string[],
  name:string,
  image:string,
  premiered:string,
}
export interface IMovieResponse {
  movieData: IEditMovieData,
  isSuccess: boolean,
  errorMessage: string
}


export interface IMoviesNamesResponse {
  moviesNames: string[],
  isSuccess: boolean,
  errorMessage: string
}

