import CardWebHome from "@/components/cardWebHome";

export default function BodyWebHome() {
  return (
    <div className="w-full px-6 py-12 flex flex-col items-center">
      {/* Judul */}
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6">
        Welcome to KMLapp
      </h1>

      {/* Deskripsi singkat */}
      <p className="text-gray-600 text-center max-w-xl mb-10">
        Explore our platforms. Click on each card to visit the website.
      </p>

      {/* Grid untuk Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl justify-center w-full">
        <CardWebHome
          logo="/Comicfy.png"
          name="Comicfy"
          link="https://Comicfy.com"
        />
        <CardWebHome
          logo="/Filmfy.png"
          name="Filmfy"
          link="https://Filmfy.com"
        />
        <CardWebHome
          logo="/Animefy.png"
          name="Animefy"
          link="https://Animefy.com"
        />
      </div>
    </div>
  );
}
