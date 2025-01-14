import { NavigationBar } from "@/components/NavigationBar";
import { ContentRow } from "@/components/ContentRow";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Movie, TVShow } from "@/services/mediaService";

interface TransformedMedia {
  id: number;
  title: string;
  image: string;
  media_type: 'movie' | 'tv';
}

const Favorites = () => {
  const [favorites] = useLocalStorage<(Movie | TVShow)[]>("favorites", []);

  const transformMediaForContentRow = (media: (Movie | TVShow)[] = []): TransformedMedia[] => {
    return media.map(item => ({
      id: item.id,
      title: 'title' in item ? item.title : item.name,
      image: `https://image.tmdb.org/t/p/w500${item.backdrop_path}`,
      media_type: item.media_type as 'movie' | 'tv'
    }));
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-vision-background">
        <NavigationBar />
        <div className="pt-32 px-6 text-center text-vision-text">
          <h1 className="text-2xl font-semibold mb-4">Your Favorites</h1>
          <p className="text-vision-text/70">You haven't added any favorites yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vision-background">
      <NavigationBar />
      <div className="pt-32 px-6">
        <h1 className="text-2xl font-semibold text-vision-text mb-8">Your Favorites</h1>
        <ContentRow
          title="Favorite Movies & TV Shows"
          items={transformMediaForContentRow(favorites)}
        />
      </div>
    </div>
  );
};

export default Favorites;