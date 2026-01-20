"use client";

import Image from "next/image";
import {
  User,
  Pencil,
  Heart,
  Ruler,
  Share2,
  PlayCircle,
  Tags,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle,
} from "lucide-react";
import InfoItem from "@/components/UI/InfoItem";
import Link from "next/link";

export interface SocialMediaItem {
  platform: string;
  url: string;
}

export interface CastFormData {
  slug: string;
  name: string;
  alias?: string;
  avatar?: string;
  birthDate?: string;
  age?: string;
  birthplace?: string;
  sign?: string;
  blood?: string;
  physical?: {
    height?: string;
    measurements?: string;
    cup?: string;
    shoeSize?: string;
    hairLength?: string;
    hairColor?: string;
  };
  profile?: {
    hobbies?: string;
    specialSkills?: string;
  };
  tags?: string[];
  socialMedia?: SocialMediaItem[];
  debut?: {
    reason?: string;
    start?: string;
    end?: string;
  };
  description?: string;
}

const getSocialIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("instagram")) return <Instagram className="w-3.5 h-3.5" />;
  if (p.includes("twitter") || p.includes("x"))
    return <Twitter className="w-3.5 h-3.5" />;
  if (p.includes("youtube")) return <Youtube className="w-3.5 h-3.5" />;
  if (p.includes("tiktok")) return <MessageCircle className="w-3.5 h-3.5" />;
  return <Globe className="w-3.5 h-3.5" />;
};

interface CastDescriptionSectionProps {
  profile: CastFormData;
}

function calculateAge(birthDate: string | undefined): string {
  if (!birthDate) return "-";

  const birth = new Date(birthDate);
  const today = new Date();

  if (isNaN(birth.getTime())) return "-";

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age > 0 ? `${age} Tahun` : "-";
}

function calculateDebutAge(
  birthDate: string | undefined,
  debutDate: string | undefined
): string {
  if (!birthDate || !debutDate) return "-";

  const birth = new Date(birthDate);
  const debut = new Date(debutDate);

  if (isNaN(birth.getTime()) || isNaN(debut.getTime())) return "-";

  let ageAtDebut = debut.getFullYear() - birth.getFullYear();
  const monthDiff = debut.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && debut.getDate() < birth.getDate())) {
    ageAtDebut--;
  }

  return ageAtDebut > 0 ? `${ageAtDebut} Tahun` : "-";
}

function calculateDebutDuration(startDate?: string, endDate?: string): string {
  if (!startDate) return "-";

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "-";
  if (end < start) return "-";

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (end.getDate() < start.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years <= 0 && months <= 0) {
    return "Kurang dari 1 bulan";
  }

  if (years <= 0) {
    return `${months} Bulan`;
  }

  if (months <= 0) {
    return `${years} Tahun`;
  }

  return `${years} Tahun ${months} Bulan`;
}

function getDebutStatus(debut?: {
  start?: string;
  end?: string;
}): "active" | "graduated" | "unknown" {
  if (!debut?.start) return "unknown";
  if (debut.end) return "graduated";
  return "active";
}

function DebutStatusBadge({ status }: { status: string }) {
  if (status === "unknown") return null;

  if (status === "active") {
    return (
      <span
        className="inline-flex items-center gap-1.5
        px-3 py-1 rounded-full
        text-[11px] font-bold uppercase tracking-wide
        bg-green-100 dark:bg-green-900/30
        text-green-700 dark:text-green-400
        border border-green-200 dark:border-green-800"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        Active
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5
      px-3 py-1 rounded-full
      text-[11px] font-bold uppercase tracking-wide
      bg-gray-100 dark:bg-gray-800
      text-gray-600 dark:text-gray-400
      border border-gray-200 dark:border-gray-700"
    >
      Graduated
    </span>
  );
}

export default function CastDescriptionSection({
  profile,
}: CastDescriptionSectionProps) {
  const currentAge = calculateAge(profile.birthDate);
  const debutAge = calculateDebutAge(profile.birthDate, profile.debut?.start);
  const debutDuration = calculateDebutDuration(
    profile.debut?.start,
    profile.debut?.end
  );
  const debutStatus = getDebutStatus(profile.debut);

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 relative shadow-sm border border-gray-100 dark:border-gray-700">
      <Link
        href={`/filmfy/cast/${profile.slug}/edit`}
        className="absolute top-6 right-6 inline-flex items-center gap-2
        text-xs font-semibold bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
      >
        <Pencil className="w-3.5 h-3.5" />
        EDIT PROFILE
      </Link>

      <div className="flex flex-col md:flex-row gap-8 pb-8 border-b border-gray-100 dark:border-gray-700/50">
        <div className="relative w-40 h-40 self-center md:self-start">
          <div className="w-full h-full rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900 border-4 border-white dark:border-gray-800 shadow-md">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <User className="w-16 h-16 text-gray-300" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {profile.name}
              </h1>

              <DebutStatusBadge status={debutStatus} />
            </div>
            {profile.alias && (
              <p className="text-blue-500 font-medium text-sm mt-1">
                aka {profile.alias}
              </p>
            )}
          </div>

          {profile.description && (
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl italic">
              "{profile.description}"
            </p>
          )}

          <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
            <div className="text-center md:text-left">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                Birth Date
              </p>
              <p className="text-sm font-semibold dark:text-gray-200">
                {profile.birthDate || "-"}
              </p>
            </div>
            <div className="text-center md:text-left border-l border-gray-100 dark:border-gray-700 px-6">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                Current Age
              </p>
              <p className="text-sm font-semibold dark:text-gray-200">
                {currentAge}
              </p>
            </div>

            <div className="text-center md:text-left border-l border-gray-100 dark:border-gray-700 px-6">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                Debut Age
              </p>
              <p className="text-sm font-semibold dark:text-gray-200">
                {debutAge}
              </p>
            </div>
            <div className="text-center md:text-left border-l border-gray-100 dark:border-gray-700 px-6">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                Debut Duration
              </p>
              <p className="text-sm font-semibold dark:text-gray-200">
                {debutDuration}
              </p>
            </div>
            <div className="text-center md:text-left border-l border-gray-100 dark:border-gray-700 px-6">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                Zodiac
              </p>
              <p className="text-sm font-semibold dark:text-gray-200">
                {profile.sign || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 pt-8">
        {profile.physical && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">
              <Ruler className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-sm uppercase tracking-wider">
                Physical Stats
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <InfoItem label="Height">
                {profile.physical.height || "-"}
              </InfoItem>
              <InfoItem label="Cup Size" className="font-bold text-pink-500">
                {profile.physical.cup || "-"}
              </InfoItem>
              <InfoItem label="Measurements">
                {profile.physical.measurements || "-"}
              </InfoItem>
              <InfoItem label="Shoe Size">
                {profile.physical.shoeSize || "-"}
              </InfoItem>
              <InfoItem label="Hair">{`${profile.physical.hairLength || "-"} (${
                profile.physical.hairColor || "-"
              })`}</InfoItem>
              <InfoItem label="Blood Type">{profile.blood || "-"}</InfoItem>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {profile.profile && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">
                <Heart className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-sm uppercase tracking-wider">
                  Interests & Skills
                </h3>
              </div>
              <div className="space-y-3">
                <InfoItem label="Hobbies">
                  {profile.profile.hobbies || "-"}
                </InfoItem>
                <InfoItem label="Special Skills">
                  {profile.profile.specialSkills || "-"}
                </InfoItem>
              </div>
            </div>
          )}

          {profile.debut && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2">
                <PlayCircle className="w-5 h-5 text-green-500" />
                <h3 className="font-bold text-sm uppercase tracking-wider">
                  Career Debut
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Start Date">
                  {profile.debut.start || "-"}
                </InfoItem>
                <InfoItem label="End Date">{profile.debut.end || "-"}</InfoItem>
                <div className="col-span-2">
                  <InfoItem label="Reason">
                    {profile.debut.reason || "-"}
                  </InfoItem>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Share2 className="w-4 h-4 text-blue-500" />
            <h3 className="font-bold text-xs uppercase tracking-widest">
              Connect
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {profile.socialMedia &&
            Array.isArray(profile.socialMedia) &&
            profile.socialMedia.length > 0 ? (
              profile.socialMedia.map((item, index) => (
                <a
                  key={index}
                  href={
                    item.url.startsWith("http")
                      ? item.url
                      : `https://${item.url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-xs font-medium hover:border-blue-500 hover:text-blue-500 transition-all shadow-sm"
                >
                  {getSocialIcon(item.platform)}
                  <span>{item.platform}</span>
                </a>
              ))
            ) : (
              <p className="text-[10px] text-gray-400 italic">
                No social media links available
              </p>
            )}
          </div>
        </div>

        {profile.tags && profile.tags.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Tags className="w-4 h-4 text-purple-500" />
              <h3 className="font-bold text-xs uppercase tracking-widest">
                Tags
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[11px] font-medium rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
