import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, DOGS_API_KEY, LIMIT } from "./dogs.const";
import {
  Breed,
  CreateFavorite,
  CreateVote,
  DogCard,
  Favorite,
  Vote,
} from "./dogs.models";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", DOGS_API_KEY);

      return headers;
    },
  }),
  tagTypes: ["Breeds", "Votes", "Favorites"],
  endpoints: (builder) => {
    return {
      fetchBreeds: builder.query<Breed[], number | void>({
        query: (limit = LIMIT) => ({
          url: "/breeds",
          params: {
            limit,
          },
        }),
        providesTags: ["Breeds"],
      }),
      fetchFavorites: builder.query<Favorite[], number | void>({
        query: (limit = LIMIT) => ({
          url: "/favourites",
          params: {
            limit,
          },
        }),
        providesTags: ["Favorites"],
      }),
      createFavorite: builder.mutation<number | void, CreateFavorite>({
        query: (initialFavorite: CreateFavorite) => ({
          url: "/favourites",
          method: "POST",
          body: initialFavorite,
        }),
        invalidatesTags: ["Favorites"],
      }),
      deleteFavorite: builder.mutation<number | void, DogCard>({
        query: (card) => ({
          url: `/favourites/${card.favorite.id}}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Favorites"],
      }),
      fetchVotes: builder.query<Vote[], number | void>({
        query: (limit = LIMIT) => ({
          url: "/votes",
          params: {
            limit,
          },
        }),
        providesTags: ["Votes"],
      }),
      createVote: builder.mutation<number | void, CreateVote>({
        query: (initialVotes: CreateVote) => ({
          url: "/votes",
          method: "POST",
          body: initialVotes,
        }),
        invalidatesTags: ["Votes"],
      }),
      deleteVote: builder.mutation<number | void, DogCard>({
        query: (card) => ({
          url: `/votes/${card.vote?.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Votes"],
      }),
    };
  },
});

export const {
  useFetchBreedsQuery,
  useFetchVotesQuery,
  useFetchFavoritesQuery,
  useCreateVoteMutation,
  useCreateFavoriteMutation,
  useDeleteVoteMutation,
  useDeleteFavoriteMutation,
} = apiSlice;
