import { NavigationBar } from "@/components/NavigationBar";
import { FeaturedContent } from "@/components/FeaturedContent";
import { ContentRow } from "@/components/ContentRow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Movie, TVShow, fetchMovies, fetchTVShows } from "@/services/mediaService";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  const popularMoviesQuery = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: () => fetchMovies('popular'),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch popular movies",
          variant: "destructive",
        });
      },
    },
  });

  const topRatedMoviesQuery = useQuery({
    queryKey: ['movies', 'top_rated'],
    queryFn: () => fetchMovies('top_rated'),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch top rated movies",
          variant: "destructive",
        });
      },
    },
  });

  const upcomingMoviesQuery = useQuery({
    queryKey: ['movies', 'upcoming'],
    queryFn: () => fetchMovies('upcoming'),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch upcoming movies",
          variant: "destructive",
        });
      },
    },
  });

  const popularTVQuery = useQuery({
    queryKey: ['tv', 'popular'],
    queryFn: () => fetchTVShows('popular'),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch popular TV shows",
          variant: "destructive",
        });
      },
    },
  });

  const topRatedTVQuery = useQuery({
    queryKey: ['tv', 'top_rated'],
    queryFn: () => fetchTVShows('top_rated'),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch top rated TV shows",
          variant: "destructive",
        });
      },
    },
  });

  const onAirTVQuery = useQuery({
    queryKey: ['tv', 'on_the_air'],
    queryFn: () => fetchTVShows('on_the_air'),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch on air TV shows",
          variant: "destructive",
        });
      },
    },
  });

  const transformMediaForContentRow = (media: (Movie | TVShow)[] = []) => {
    return media.map(item => ({
      id: item.id,
      title: 'title' in item ? item.title : item.name,
      image: `https://image.tmdb.org/t/p/w500${item.backdrop_path}`,
      media_type: item.media_type,
    }));
  };

  return (
    <div className="min-h-screen bg-vision-background text-vision-text">
      <NavigationBar />
      <FeaturedContent />
      <div className="relative z-10 px-6 space-y-8 -mt-8">
        <Tabs defaultValue="movies" className="w-full mt-12">
          <TabsList className="bg-vision-background/80 backdrop-blur-xl w-full justify-start rounded-2xl border border-white/5 p-1.5 shadow-lg">
            <TabsTrigger 
              value="movies" 
              className="data-[state=active]:bg-white/10 data-[state=active]:backdrop-blur-xl data-[state=active]:text-white text-white/70 transition-all duration-300 rounded-xl px-6 py-2"
            >
              Movies
            </TabsTrigger>
            <TabsTrigger 
              value="tv" 
              className="data-[state=active]:bg-white/10 data-[state=active]:backdrop-blur-xl data-[state=active]:text-white text-white/70 transition-all duration-300 rounded-xl px-6 py-2"
            >
              TV Shows
            </TabsTrigger>
          </TabsList>

          <TabsContent value="movies" className="space-y-8 mt-8">
            {popularMoviesQuery.isLoading ? (
              <div className="text-center text-white/70">Loading popular movies...</div>
            ) : (
              <ContentRow 
                title="Popular Movies" 
                items={transformMediaForContentRow(popularMoviesQuery.data)} 
              />
            )}

            {topRatedMoviesQuery.isLoading ? (
              <div className="text-center text-white/70">Loading top rated movies...</div>
            ) : (
              <ContentRow 
                title="Top Rated Movies" 
                items={transformMediaForContentRow(topRatedMoviesQuery.data)} 
              />
            )}

            {upcomingMoviesQuery.isLoading ? (
              <div className="text-center text-white/70">Loading upcoming movies...</div>
            ) : (
              <ContentRow 
                title="Upcoming Movies" 
                items={transformMediaForContentRow(upcomingMoviesQuery.data)} 
              />
            )}
          </TabsContent>

          <TabsContent value="tv" className="space-y-8 mt-8">
            {popularTVQuery.isLoading ? (
              <div className="text-center text-white/70">Loading popular TV shows...</div>
            ) : (
              <ContentRow 
                title="Popular TV Shows" 
                items={transformMediaForContentRow(popularTVQuery.data)} 
              />
            )}

            {topRatedTVQuery.isLoading ? (
              <div className="text-center text-white/70">Loading top rated TV shows...</div>
            ) : (
              <ContentRow 
                title="Top Rated TV Shows" 
                items={transformMediaForContentRow(topRatedTVQuery.data)} 
              />
            )}

            {onAirTVQuery.isLoading ? (
              <div className="text-center text-white/70">Loading currently airing TV shows...</div>
            ) : (
              <ContentRow 
                title="Currently Airing TV Shows" 
                items={transformMediaForContentRow(onAirTVQuery.data)} 
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
