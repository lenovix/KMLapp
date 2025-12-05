"use client";

import CardWebHome from "@/components/Home/cardWebHome";

export default function KomifyHome() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Comicfy Home
      </h1>

      {/* Grid comic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <CardWebHome
          logo="/comic1.png"
          name="Comic One"
          link="/comicfy/comic1"
          version="v1.0"
        />
        <CardWebHome
          logo="/comic2.png"
          name="Comic Two"
          link="/comicfy/comic2"
          version="v1.2"
        />
        <CardWebHome
          logo="/comic3.png"
          name="Comic Three"
          link="/comicfy/comic3"
          version="v1.0"
        />
        <CardWebHome
          logo="/comic4.png"
          name="Comic Four"
          link="/comicfy/comic4"
          version="v1.1"
        />
        {/* Bisa ditambahkan card lain */}
      </div>
    </div>
  );
}
