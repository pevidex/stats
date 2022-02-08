import axios from "axios";
import { Post } from "../definitions";
import { ApiError, HttpError, TokenError } from "./postsRawData";

type PostRepository = (params: PostsParams, url: string) => Promise<Post[]>;
type TokenRepository = (body: TokenBody, url: string) => Promise<string>;

export interface TokenBody {
  client_id: string;
  email: string;
  name: string;
}

export interface PostsParams {
  sl_token: string;
  page: number;
}

interface Meta {
  request_id: string;
}

interface Error {
  message: string;
}

interface TokenResponse {
  meta: Meta;
  data: {
    client_id: string;
    email: string;
    sl_token: string;
  };
  error?: Error;
}

interface PostsResponse {
  meta: Meta;
  data: {
    page: number;
    posts: Post[];
  };
  error?: Error;
}

export const fetchTokenGen = (
  clientId: string,
  email: string,
  name: string,
  tokenUrl: string
) => {
  const tokenBody: TokenBody = {
    client_id: clientId,
    email,
    name,
  };
  return () => fetchToken(tokenBody, tokenUrl);
};

export const fetchPostsByPageGen =
  (postsUrl: string) => (params: PostsParams) =>
    fetchPostsByPage(params, postsUrl);

export const fetchPostsByPage: PostRepository = (
  params: PostsParams,
  url: string
) => {
  return axios.get<PostsResponse>(url, { params }).then((value) => {
    if (value.status !== 200) {
      throw new HttpError(`HTTP request failed with error: ${value.status}`);
    }
    const error = value.data.error;
    if (error?.message && error.message.includes("Invalid SL Token")) {
      throw new TokenError(`Api returned an error: ${error.message}`);
    } else if (error?.message) {
      throw new ApiError(`Api returned an error: ${error.message}`);
    }
    return value.data.data.posts;
  });
};

export const fetchToken: TokenRepository = (body: TokenBody, url: string) => {
  return axios.post<TokenResponse>(url, body).then((value) => {
    if (value.status !== 200) {
      throw new HttpError(`HTTP request failed with error ${value.status}`);
    }
    if (value.data.error) {
      throw new ApiError(`Api returned an error: ${value.data.error}`);
    }
    return value.data.data.sl_token;
  });
};
