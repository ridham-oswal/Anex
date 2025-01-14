import { useQuery } from "@tanstack/react-query";
import { fetchMovies } from "@/services/mediaService";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const FeaturedContent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const { data: movies } = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: () => fetchMovies('popular'),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch featured content",
          variant: "destructive",
        });
      },
    },
  });

  useEffect(() => {
    if (movies && movies.length > 0) {
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => 
            prevIndex === Math.min(movies.length - 1, 9) ? 0 : prevIndex + 1
          );
          setIsTransitioning(false);
        }, 500); // Half of the transition duration
      }, 8000); // 8 seconds interval

      return () => clearInterval(interval);
    }
  }, [movies]);

  const featuredMovie = movies?.[currentIndex];

  if (!featuredMovie) {
    return null;
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] md:h-screen">
      <div className="absolute inset-0">
        <img
          src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
          alt={featuredMovie.title}
          className={`w-full h-full object-cover transition-all duration-1000 ${
            isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vision-background via-vision-background/50 to-transparent" />
      </div>
      <div className="relative h-full flex items-center px-6">
        <div className={`max-w-2xl transition-all duration-1000 ${
          isTransitioning ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
        }`}>
          <h1 className="text-4xl md:text-6xl font-bold text-vision-text mb-4">
            {featuredMovie.title}
          </h1>
          <p className="text-lg md:text-xl text-vision-text/80 mb-8 line-clamp-3 md:line-clamp-none">
            {featuredMovie.overview}
          </p>
          <button 
            onClick={() => navigate(`/movie/${featuredMovie.id}`)}
            className="bg-vision-text text-vision-background px-6 md:px-8 py-2 md:py-3 rounded-full text-base md:text-lg font-semibold hover:bg-vision-text/90 transition-colors"
          >
            Watch Now
          </button>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {movies?.slice(0, 10).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
              }, 500);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-vision-text w-4' : 'bg-vision-text/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};