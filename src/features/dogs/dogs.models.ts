export interface BreedImage {
  id: string;
  width: number;
  height: number;
  url: string;
}

export interface BreedParams {
  imperial: string;
  metric: string;
}

export interface Breed {
  bred_for: string;
  breed_group: string;
  height: BreedParams;
  id: number;
  image: BreedImage;
  life_span: string;
  name: string;
  origin: string;
  reference_image_id: string;
  temperament: string;
  weight: BreedParams;
}

export interface Favorite {
  id: number;
  user_id: string;
  image_id: string;
  sub_id: string;
  created_at: string;
  image: {
    id: string;
    url: string;
  };
}

export interface CreateFavorite {
  image_id: string;
  sub_id: string;
}

export interface Vote {
  image_id: string;
  sub_id: string;
  value: number;
  created_at: string;
  id: string;
  country_code: string;
}

export interface CreateVote {
  image_id: string;
  sub_id: string;
  value: number;
}

export interface DogCard {
  sub_id: string;
  favorite: Favorite;
  breed?: Breed;
  vote?: Vote;
}
