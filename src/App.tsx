import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useCreateFavoriteMutation,
  useCreateVoteMutation,
  useDeleteFavoriteMutation,
  useDeleteVoteMutation,
  useFetchBreedsQuery,
  useFetchFavoritesQuery,
  useFetchVotesQuery,
} from "./features/dogs/dogs-api-slice";
import "./App.css";
import { DOGS_API_KEY } from "./features/dogs/dogs.const";
import { Card } from "./components/card/card";
import {
  Breed,
  CreateFavorite,
  CreateVote,
  DogCard,
  Vote,
} from "./features/dogs/dogs.models";
import { ToggleSwich } from "./components/toggle_swich/toggle_swich";

function App() {
  const { data: breedData } = useFetchBreedsQuery();
  const { data: votesData, isLoading: voteLoading } = useFetchVotesQuery();
  const { data: favoriteData, isLoading: favoriteLoading } =
    useFetchFavoritesQuery();
  const [addVote, { isLoading: AddVoteLoading }] = useCreateVoteMutation();
  const [deleteVote, { isLoading: deleteVoteLoading }] =
    useDeleteVoteMutation();
  const [addFavorite, { isLoading: addFavoriteLoading }] =
    useCreateFavoriteMutation();
  const [deleteFavorite, { isLoading: deleteFavoriteLoading }] =
    useDeleteFavoriteMutation();
  const [filter, setFilter] = useState<boolean>();

  const isLoadingSmth = useMemo(() => {
    return (
      voteLoading ||
      favoriteLoading ||
      AddVoteLoading ||
      deleteVoteLoading ||
      addFavoriteLoading ||
      deleteFavoriteLoading
    );
  }, [
    favoriteLoading,
    voteLoading,
    addFavoriteLoading,
    deleteVoteLoading,
    deleteFavoriteLoading,
    AddVoteLoading,
  ]);

  const dogsData = useMemo(() => {
    if (!favoriteData || !breedData) {
      return [];
    }
    const breedMap = new Map<string, Breed>();
    breedData.forEach((breed) => breedMap.set(breed.image.id, breed));

    const voteMap = new Map<string, Vote>();
    votesData?.forEach((vote) => voteMap.set(vote.image_id, vote));

    const dogCards: DogCard[] = favoriteData.map((favorite) => {
      return {
        favorite,
        breed: breedMap.get(favorite.image.id),
        sub_id: DOGS_API_KEY,
        vote: voteMap.get(favorite.image.id),
      };
    });

    if (filter) {
      return dogCards.filter((el) => !!el.vote?.value);
    }

    return dogCards;
  }, [breedData, votesData, favoriteData, filter]);

  const handleLike = useCallback(
    (card: DogCard) => {
      if (card.vote?.value) {
        deleteVote(card);
      } else {
        const body: CreateVote = {
          image_id: card.favorite.image_id,
          sub_id: DOGS_API_KEY,
          value: 1,
        };
        addVote(body);
      }
    },
    [deleteVote, addVote]
  );

  const handleDelete = useCallback(
    (card: DogCard) => {
      deleteVote(card);
      deleteFavorite(card);
    },
    [deleteVote, deleteFavorite]
  );

  const refreshFavorites = useCallback(() => {
    breedData?.forEach((breed) => {
      const initialFavorite: CreateFavorite = {
        image_id: breed.image.id,
        sub_id: DOGS_API_KEY,
      };
      addFavorite(initialFavorite);
    });
  }, [breedData, addFavorite]);

  const clearVotes = useCallback(() => {
    dogsData?.forEach((el) => {
      deleteVote(el);
    });
  }, [dogsData, deleteVote]);

  const clearFavs = useCallback(() => {
    dogsData?.forEach(deleteFavorite);
  }, [dogsData, deleteFavorite]);

  useEffect(() => {
    refreshFavorites();
  }, []);

  return (
    <div className={"wrapper"}>
      <div className={"navigation"}>
        <div className="helpers">
          <div onClick={refreshFavorites}>Refresh list</div>
          <div onClick={clearVotes}>Clear likes</div>
          <div onClick={clearFavs}>Clear list</div>
        </div>
        <ToggleSwich
          handleChange={() => setFilter((prevState) => !prevState)}
        />
      </div>
      <div className="cards_wrapper">
        {dogsData?.map((data) => (
          <Card onDelete={handleDelete} card={data} onLike={handleLike} />
        ))}
      </div>
      {isLoadingSmth && <div className="loading">Loading...</div>}
    </div>
  );
}

export default App;
