import { QueryFunction } from "react-query";

const API_KEY = "9db5794f039ec550f11e71750544ca9e";
const BASE_URL = "https://api.themoviedb.org/3";

export interface IMovie {
  adult: boolean;
  first_air_date: undefined;
  origin_country: undefined;
  backdrop_path: string;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  name: undefined;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface IGetMoviesResult {
  dates?: {
    maximum: string;
    minimum: string;
  };
  page?: number;
  results: IMovie[];
  total_pages?: number;
  total_results?: number;
}

export interface IMovieVideo {
  id: number;
  results: {
    key: string;
    type: string;
    name: string;
  }[];
}

export const movieApi = {
  getNowPlaying: () => {
    return fetch(
      `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=ko&region=KR`
    ).then((response) => response.json());
  },
  getLatest: () => {
    return fetch(
      `${BASE_URL}/movie/latest?api_key=${API_KEY}&language=ko&region=KR`
    ).then((response) => response.json());
  },
  getPopular: () => {
    return fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko&region=KR`
    ).then((response) => response.json());
  },
  getUpcoming: () => {
    return fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=ko&region=KR`
    ).then((response) => response.json());
  },
  getTopRated: () => {
    return fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=ko&region=KR`
    ).then((response) => response.json());
  },
  getDetails: (movieId: string | undefined) => {
    if (movieId === undefined) return null;
    return fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko`
    ).then((response) => response.json());
  },
  getVideos: (movieId: number | undefined) => {
    if (movieId === undefined) return null;
    return fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=ko`
    ).then((response) => response.json());
  },
};

export interface ITV {
  adult: undefined;
  first_air_date: string;
  origin_country: string;
  backdrop_path: string;
  id: number;
  original_language: string;
  original_title: undefined;
  overview: string;
  popularity: number;
  poster_path: string;
  name: string;
  release_date: undefined;
  title: undefined;
  video: undefined;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface IGetTVResult {
  dates?: undefined;
  page?: number;
  results: ITV[];
  total_pages?: number;
  total_results?: number;
}

export const tvApi = {
  getLatest: () => {
    return fetch(
      `${BASE_URL}/tv/latest?api_key=${API_KEY}&language=ko&region=KR`
    ).then((response) => response.json());
  },
  getAiringToday: () => {
    return fetch(
      `${BASE_URL}/tv/airing_today?api_key=${API_KEY}&language=ko&region=KR`
    ).then((response) => response.json());
  },
  getPopular: () => {
    return fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=ko&region=KR`
    ).then((response) => response.json());
  },
  getTopRated: () => {
    return fetch(
      `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=ko&region=KR`
    ).then((response) => response.json());
  },
  getDetails: (tvId: string | undefined) => {
    if (tvId === undefined) return null;
    return fetch(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=ko`).then(
      (response) => response.json()
    );
  },
  getSeasons: (
    tvId: string | undefined,
    seasonNumbers: number[] | undefined
  ) => {
    if (tvId === undefined) return null;
    if (seasonNumbers === undefined) return null;
    const seasonData = seasonNumbers.map((seasonNumber) =>
      fetch(
        `${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}&language=ko`
      ).then((response) => response.json())
    );
    return Promise.all(seasonData);
  },
};

export const searchApi = {
  getMulti: (keyword: string | null | undefined) => {
    return fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${keyword}&language=ko&region=KR`
    ).then((response) => response.json());
  },
};
