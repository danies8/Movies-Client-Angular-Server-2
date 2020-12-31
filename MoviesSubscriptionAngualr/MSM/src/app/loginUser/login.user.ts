export interface LoginUser {
  isSuccess: boolean,
  results: {
    isUserExist: boolean,
    userName: string;
    userrId: string,
    isUserAdmin: boolean;
    hasPermissionForSubscriptions: boolean,
    hasPermissionForCreateSubscriptions: boolean,
    hasPermissionForEditSubscriptions: boolean,
    hasPermissionForDeleteSubscriptions: boolean,
    hasPermissionForMovies: boolean,
    hasPermissionForCreateMovies: boolean,
    hasPermissionForEditMovies: boolean,
    hasPermissionForDeleteMovies: boolean,
  },
  errorMessage: string,
  accessToken: string,

}

export interface IEditLoginUser {
    userName: string;
    password: string,
}
