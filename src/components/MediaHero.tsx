import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface MediaHeroProps {
  backdropPath: string;
  title: string;
}

export const MediaHero = ({ backdropPath, title }: MediaHeroProps) => (
  <div className="fixed top-0 left-0 right-0 h-[70vh] z-0">
    <div className="absolute inset-0">
      <img
        src={`https://image.tmdb.org/t/p/original${backdropPath}`}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-vision-background via-vision-background/80 to-transparent" />
    </div>

    <Link 
      to="/" 
      className="absolute top-6 left-4 sm:left-6 z-10 flex items-center gap-2 text-vision-text/90 hover:text-vision-text transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="hidden sm:inline">Back to Home</span>
    </Link>
  </div>
);