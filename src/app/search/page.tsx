import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-10 max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Search</h1>
          <p className="text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}