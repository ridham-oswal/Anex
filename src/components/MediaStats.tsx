import { Clock, Star, Calendar, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { PlayCircle } from "lucide-react";

interface MediaStatsProps {
  mediaType: 'movie' | 'tv';
  voteAverage: number;
  runtime?: number;
  releaseDate: string;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  isFavorite: boolean;
  onFavoriteClick: () => void;
  onTrailerClick: () => void;
  trailerAvailable: boolean;
}

export const MediaStats = ({
  mediaType,
  voteAverage,
  runtime,
  releaseDate,
  numberOfSeasons,
  numberOfEpisodes,
  isFavorite,
  onFavoriteClick,
  onTrailerClick,
  trailerAvailable
}: MediaStatsProps) => (
  <div className="flex flex-wrap gap-4 sm:gap-6 mb-6 items-center">
    <div className="flex items-center gap-2">
      <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
      <span className="font-semibold">{voteAverage.toFixed(1)}</span>
    </div>
    
    {mediaType === 'tv' ? (
      <>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-vision-text/80" />
          <span>{numberOfSeasons} Seasons</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-vision-text/80" />
          <span>{numberOfEpisodes} Episodes</span>
        </div>
      </>
    ) : (
      <>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-vision-text/80" />
          <span>{runtime} min</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-vision-text/80" />
          <span>{new Date(releaseDate).getFullYear()}</span>
        </div>
      </>
    )}
    
    <button 
      onClick={onFavoriteClick}
      className={`flex items-center gap-2 transition-colors ${
        isFavorite ? 'text-red-500' : 'text-vision-text/80 hover:text-red-500'
      }`}
    >
      <Heart className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
      <span className="hidden sm:inline">
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </span>
    </button>

    {trailerAvailable && (
      <Button
        onClick={onTrailerClick}
        variant="secondary"
        className="flex items-center gap-2"
      >
        <PlayCircle className="w-5 h-5" />
        <span className="hidden sm:inline">Watch Trailer</span>
      </Button>
    )}
  </div>
);