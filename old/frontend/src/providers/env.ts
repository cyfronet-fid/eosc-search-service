import { AuthApi, Configuration, UsersApi } from "../generated";

// prettier-ignore
export const basePath = process.env.REACT_APP_API_BASE || "http://localhost:8000";

const readAccessToken = async (): Promise<string> => {
  return localStorage.getItem("token") || "";
};

const apiConfig: Configuration = new Configuration({
  basePath,
  accessToken: readAccessToken,
});

export const authApi: AuthApi = new AuthApi(apiConfig);
export const userApi: UsersApi = new UsersApi(apiConfig);
