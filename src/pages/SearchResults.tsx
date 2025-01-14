import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "@/services/mediaService";
import { NavigationBar } from "@/components/NavigationBar";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: media, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchMovies(query),
    enabled: !!query,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to search movies and TV shows",
          variant: "destructive",
        });
      },
    },
  });

  if (!query) {
    return (
      <div className="min-h-screen bg-vision-background">
        <NavigationBar />
        <div className="pt-32 px-6 text-center text-vision-text">
          <h1 className="text-2xl font-semibold">Enter a search term to begin</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vision-background">
      <NavigationBar />
      <div className="pt-32 px-6">
        <h1 className="text-2xl font-semibold text-vision-text mb-8">
          Search Results for "{query}"
        </h1>
        {isLoading ? (
          <div className="text-vision-text">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {media?.map((item) => (
              <div
                key={item.id}
                className="cursor-pointer"
                onClick={() => navigate(`/movie/${item.id}?type=${item.media_type || 'movie'}`)}
              >
                <div className="relative group">
                  <img
                    src={
                      item.backdrop_path
                        ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
                        : "/placeholder.svg"
                    }
                    alt={'title' in item ? item.title : item.name}
                    className="w-full aspect-video object-cover rounded-lg transform transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vision-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-vision-text font-semibold">
                        {'title' in item ? item.title : item.name}
                      </h3>
                      <span className="text-sm text-vision-text/70 capitalize">
                        {item.media_type || 'movie'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;