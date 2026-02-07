import HeaderHome from "@/components/Home/headerHome";
import CardWebHome from "@/components/Home/cardWebHome";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      <HeaderHome />
      <main className="relative pt-20 px-6 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-900/20 blur-[120px] rounded-full" />
        <div className="mx-auto flex flex-col items-center relative z-10">
          <div className="text-center mb-20">
            <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium tracking-widest uppercase text-blue-400 mb-6 inline-block">
              Digital Ecosystem
            </span>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-linear-to-b from-white to-white/40">
              K-Platforms
            </h1>
            <p className="text-slate-400 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed font-light">
              Elevating digital experiences through a suite of
              <span className="text-white font-normal">
                {" "}
                premium interconnected platforms.
              </span>
            </p>
          </div>

          <div className="grid grid-cols-5 gap-8 w-full">
            <CardWebHome
              logo="/img/logo/Komify2.png"
              name="Komify"
              status="release"
              version="1.0"
              startDate="17 Juli 2025"
              endDate="20 Januari 2026"
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
              startDate="05 Januari 2026"
              endDate="Present"
              status="development"
              link="/peoplefy"
            />
            <CardWebHome
              logo="/Genfy.png"
              name="Genfy"
              startDate="27 Januari 2026"
              endDate="Present"
              status="development"
              link="/genfy"
            />
            <CardWebHome
              logo="/Assetfy.png"
              name="Assetfy"
              startDate="07 February 2026"
              endDate="Present"
              status="development"
              link="/assetfy"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
