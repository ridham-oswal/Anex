import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Content {
  id: number;
  title: string;
  image: string;
  media_type?: 'movie' | 'tv';
}

export const ContentRow = ({
  title,
  items,
}: {
  title: string;
  items: Content[];
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="py-8">
      <h2 className="text-vision-text text-xl md:text-2xl font-semibold mb-4 px-4 md:px-6">
        {title}
      </h2>
      <div className="group relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-vision-background/50 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6 text-vision-text" />
        </button>
        <div
          ref={rowRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 px-4 md:px-6"
        >
          {items.map((item) => (
            <ContentCard key={item.id} content={item} isTV={title.toLowerCase().includes('tv')} />
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-vision-background/50 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6 text-vision-text" />
        </button>
      </div>
    </div>
  );
};

const ContentCard = ({ content, isTV }: { content: Content; isTV: boolean }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="flex-none w-[280px] md:w-[320px] snap-start"
      onClick={() => navigate(`/movie/${content.id}?type=${isTV ? 'tv' : 'movie'}`)}
    >
      <div className="relative cursor-pointer">
        <img
          src={content.image}
          alt={content.title}
          className="w-full aspect-[16/9] object-cover rounded-lg transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vision-background/80 to-transparent opacity-0 hover:opacity-100 transition-opacity rounded-lg">
          <div className="absolute bottom-4 left-4">
            <h3 className="text-vision-text font-semibold">{content.title}</h3>
            <span className="text-sm text-vision-text/70 capitalize">
              {isTV ? 'TV Show' : 'Movie'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};