export interface User {
  userData: UserData,
  permissions: string[],
  userName: string
}
export interface UserData {
  id: string,
  firstName: string,
  lastName: string,
  createdDate: string,
  sessionTimeout: string,
  loginId: string
}

export interface IUsersResponse {
  results: User[],
  isSuccess: boolean,
  errorMessage: string
}

export interface IUserResponse {
  results: User,
  isSuccess: boolean,
  errorMessage: string
}

export interface IUserExistsResponse {
  isSuccess: boolean,
  errorMessage: string
}

