import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const NavigationBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-black/0 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          <Link 
            to="/" 
            className="text-2xl font-bold text-vision-text tracking-tight hover:text-vision-text/80 transition-colors font-orbitron"
          >
            Prinex
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vision-text/50 group-hover:text-vision-text/70 transition-colors" />
              <Input
                type="search"
                placeholder="Search movies & TV shows..."
                className="w-full pl-12 pr-4 py-2.5 bg-white/5 hover:bg-white/10 focus:bg-white/10 border-white/10 hover:border-white/20 focus:border-white/20 text-vision-text placeholder:text-vision-text/50 rounded-2xl transition-all duration-300 font-orbitron"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <div className="flex items-center gap-4">
            <Link to="/favorites">
              <Button 
                variant="ghost" 
                className="text-vision-text hover:text-vision-text/70 hover:bg-white/5 rounded-xl px-6 font-orbitron"
              >
                Favorites
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};