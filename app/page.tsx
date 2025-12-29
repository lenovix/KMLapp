import HeaderHome from "@/components/Home/headerHome";
import CardWebHome from "@/components/Home/cardWebHome";

export default function Home() {
  return (
    <>
      <HeaderHome />
      <div className="w-full px-6 py-12 flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6">
          Welcome to K-Platforms
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl justify-center w-full">
          <CardWebHome
            logo="/img/logo/Komify2.png"
            name="Komify"
            status="release"
            version="1.0"
            startDate="17 Juli 2025"
            endDate="23 December 2025"
            link="/komify"
          />
          <CardWebHome
            logo="/Filmfy.png"
            name="Filmfy"
            status="development"
            startDate="17 December 2025"
            endDate="Present"
            link="/filmfy"
          />
          <CardWebHome
            logo="/Peoplefy.png"
            name="Peoplefy"
            status="not-started"
            link="/Peoplefy"
          />
        </div>
      </div>
    </>
  );
}
