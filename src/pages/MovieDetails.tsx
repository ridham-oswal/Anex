import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMovieDetails, fetchTVSeasonDetails } from "@/services/mediaService";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useState, useEffect } from "react";
import { MediaHero } from "@/components/MediaHero";
import { MediaStats } from "@/components/MediaStats";
import { TrailerDialog } from "@/components/TrailerDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MovieDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const mediaType = searchParams.get('type') === 'tv' ? 'tv' : 'movie';
  const { toast } = useToast();
  const [favorites, setFavorites] = useLocalStorage<any[]>("favorites", []);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<string>("1");
  
  const { data: media, isLoading: isMediaLoading } = useQuery({
    queryKey: ['media', id, mediaType],
    queryFn: () => fetchMovieDetails(Number(id), mediaType),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: `Failed to fetch ${mediaType === 'tv' ? 'TV show' : 'movie'} details`,
          variant: "destructive",
        });
      },
    },
  });

  const { data: seasonDetails, isLoading: isSeasonLoading } = useQuery({
    queryKey: ['season', id, selectedSeason],
    queryFn: () => fetchTVSeasonDetails(Number(id), Number(selectedSeason)),
    enabled: mediaType === 'tv' && !!media,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch season details",
          variant: "destructive",
        });
      },
    },
  });

  useEffect(() => {
    if (media) {
      const isCurrentlyFavorite = favorites.some((fav) => fav.id === media.id);
      setIsFavorite(isCurrentlyFavorite);
    }
  }, [media, favorites]);

  const handleFavoriteClick = () => {
    if (!media) return;

    const newFavorite = {
      id: media.id,
      title: mediaType === 'tv' ? media.name : media.title,
      backdrop_path: media.backdrop_path,
      media_type: mediaType,
    };

    if (isFavorite) {
      const updatedFavorites = favorites.filter((fav) => fav.id !== media.id);
      setFavorites(updatedFavorites);
      setIsFavorite(false);
      toast({
        title: "Removed from favorites",
        description: `${mediaType === 'tv' ? media.name : media.title} has been removed from your favorites`,
      });
    } else {
      setFavorites([...favorites, newFavorite]);
      setIsFavorite(true);
      toast({
        title: "Added to favorites",
        description: `${mediaType === 'tv' ? media.name : media.title} has been added to your favorites`,
      });
    }
  };

  if (isMediaLoading) {
    return (
      <div className="min-h-screen bg-vision-background text-vision-text flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!media) return null;

  const title = mediaType === 'tv' ? media.name : media.title;
  const releaseDate = mediaType === 'tv' ? media.first_air_date : media.release_date;
  const trailerVideo = media.videos?.results?.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );

  return (
    <div className="min-h-screen bg-vision-background text-vision-text">
      <MediaHero backdropPath={media.backdrop_path} title={title} />

      <div className="relative mt-[70vh] px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <div className="w-full lg:-mt-32 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                  alt={title}
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div className="flex-1 lg:-mt-32 z-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{title}</h1>
              
              <MediaStats
                mediaType={mediaType}
                voteAverage={media.vote_average}
                runtime={media.runtime}
                releaseDate={releaseDate}
                numberOfSeasons={media.number_of_seasons}
                numberOfEpisodes={media.number_of_episodes}
                isFavorite={isFavorite}
                onFavoriteClick={handleFavoriteClick}
                onTrailerClick={() => setIsTrailerOpen(true)}
                trailerAvailable={!!trailerVideo}
              />

              {mediaType === 'tv' && media.number_of_seasons > 1 && (
                <div className="mb-6">
                  <Select
                    value={selectedSeason}
                    onValueChange={setSelectedSeason}
                  >
                    <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: media.number_of_seasons }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          Season {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {seasonDetails && (
                    <div className="mt-4 space-y-4">
                      <p className="text-lg font-semibold">
                        Season {selectedSeason} • {seasonDetails.episodes?.length} Episodes
                      </p>
                      <p className="text-vision-text/80">{seasonDetails.overview}</p>
                      <div className="grid gap-4 mt-4">
                        {seasonDetails.episodes?.map((episode: any) => (
                          <div 
                            key={episode.id}
                            className="bg-white/5 backdrop-blur-sm rounded-lg p-4 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">
                                  {episode.episode_number}. {episode.name}
                                </h3>
                                <p className="text-sm text-vision-text/70 mt-1">
                                  {episode.air_date}
                                </p>
                              </div>
                              <span className="text-sm bg-vision-text/10 px-2 py-1 rounded">
                                {episode.runtime}min
                              </span>
                            </div>
                            <p className="text-sm text-vision-text/80 mt-2">
                              {episode.overview}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                {media.genres.map((genre: { id: number; name: string }) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 rounded-full bg-vision-text/10 text-sm backdrop-blur-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {media.tagline && (
                <p className="text-xl italic text-vision-text/80 mb-4 font-serif">
                  "{media.tagline}"
                </p>
              )}

              <p className="text-lg leading-relaxed text-vision-text/90">
                {media.overview}
              </p>
            </div>
          </div>

          {/* Cast Section */}
          <div className="py-12">
            <h2 className="text-2xl font-bold mb-8">Featured Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {media.credits.cast.slice(0, 6).map((actor) => (
                <div 
                  key={actor.id} 
                  className="group relative overflow-hidden rounded-xl bg-vision-card/30 backdrop-blur-sm transition-transform hover:-translate-y-1"
                >
                  <img
                    src={actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : '/placeholder.svg'}
                    alt={actor.name}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                    <h3 className="font-semibold text-sm mb-1">{actor.name}</h3>
                    <p className="text-xs text-vision-text/70">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Production Companies */}
          <div className="pb-16">
            <h2 className="text-2xl font-bold mb-8">Production</h2>
            <div className="flex flex-wrap gap-6">
              {media.production_companies
                .filter(company => company.logo_path)
                .map((company) => (
                  <div 
                    key={company.id} 
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-4 hover:bg-white/10 transition-colors"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w185${company.logo_path}`}
                      alt={company.name}
                      className="h-8 sm:h-12 object-contain"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <TrailerDialog
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerKey={trailerVideo?.key}
        title={title}
      />
    </div>
  );
};

export default MovieDetails;