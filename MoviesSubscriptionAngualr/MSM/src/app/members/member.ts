export interface MemberDataArr {
  memberData:MemberData,
  moviesData:MovieData[]
}
export interface MemberData {
   _id:string,
  name:string,
  email:string,
  city:string,
}
export interface MovieData {
  _id:string,
 date:string,
 name:string,
}
export interface IMembersResponse {
  membersDataArr: MemberDataArr[],
  isSuccess: boolean,
  errorMessage: string
}

export interface IEditMemberData {
  _id:string,
  name:string,
  email:string,
  city:string,
}
export interface IMemberResponse {
  member: IEditMemberData,
  isSuccess: boolean,
  errorMessage: string
}

export interface ISubscribeNewMovieResponse {
  isSuccess: boolean,
  errorMessage: string
}





