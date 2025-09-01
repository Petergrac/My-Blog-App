"use client";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type SearchResult = {
  id: string;
  title: string;
  slug: string; // or use `id` if slug doesn't exist
};

const ProgressiveSearch = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(input, 300);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${debouncedQuery}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSelect = (slug: string) => {
    router.push(`/blog/${slug}`);
    setInput(""); // clear input after redirect
    setResults([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search articles..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
      />
      {loading && (
        <Loader2 className="animate-spin absolute right-3 top-2.5 text-muted-foreground" size={18} />
      )}
      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 rounded-md bg-background border shadow-lg max-h-60 overflow-auto">
          {results.map((result) => (
            <div
              key={result.id}
              onClick={() => handleSelect(result.id)}
              className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
            >
              {result.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressiveSearch;
