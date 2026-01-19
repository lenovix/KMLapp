"use client";

import Image from "next/image";
import { User, Pencil } from "lucide-react";
import InfoItem from "@/components/UI/InfoItem";
import Link from "next/link";

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

  socialMedia?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
  };

  debut?: {
    reason?: string;
    start?: string;
    end?: string;
  };

  description?: string;
}

interface CastDescriptionSectionProps {
  profile: CastFormData;
}

export default function CastDescriptionSection({
  profile,
}: CastDescriptionSectionProps) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 relative space-y-8">
      <Link
        href={`/filmfy/cast/${profile.slug}/edit`}
        className="absolute top-4 right-4 inline-flex items-center gap-1
        text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-500"
      >
        <Pencil className="w-4 h-4" />
        Edit
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6">
        <div className="flex justify-center md:justify-start">
          <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 border">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={128}
                height={128}
                unoptimized
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {profile.name}
          </h1>

          {profile.alias && (
            <p className="text-sm text-gray-500">
              Alias: <span className="font-medium">{profile.alias}</span>
            </p>
          )}

          {profile.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 max-w-2xl">
              {profile.description}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <InfoItem label="Tanggal Lahir">{profile.birthDate || "-"}</InfoItem>
        <InfoItem label="Usia">{profile.age || "-"}</InfoItem>
        <InfoItem label="Tempat Lahir">{profile.birthplace || "-"}</InfoItem>
        <InfoItem label="Zodiak">{profile.sign || "-"}</InfoItem>
        <InfoItem label="Golongan Darah">{profile.blood || "-"}</InfoItem>
      </div>

      {profile.physical && (
        <div>
          <h3 className="section-title">Physical</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoItem label="Tinggi">{profile.physical.height || "-"}</InfoItem>
            <InfoItem label="Measurements">
              {profile.physical.measurements || "-"}
            </InfoItem>
            <InfoItem label="Cup">{profile.physical.cup || "-"}</InfoItem>
            <InfoItem label="Shoe Size">
              {profile.physical.shoeSize || "-"}
            </InfoItem>
            <InfoItem label="Hair Length">
              {profile.physical.hairLength || "-"}
            </InfoItem>
            <InfoItem label="Hair Color">
              {profile.physical.hairColor || "-"}
            </InfoItem>
          </div>
        </div>
      )}

      {profile.profile && (
        <div>
          <h3 className="section-title">Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Hobbies">
              {profile.profile.hobbies || "-"}
            </InfoItem>
            <InfoItem label="Special Skills">
              {profile.profile.specialSkills || "-"}
            </InfoItem>
          </div>
        </div>
      )}

      {profile.socialMedia && (
        <div>
          <h3 className="section-title">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(profile.socialMedia).map(
              ([key, value]) =>
                value && (
                  <InfoItem key={key} label={key}>
                    <a
                      href={value}
                      target="_blank"
                      className="text-blue-500 hover:underline break-all"
                    >
                      {value}
                    </a>
                  </InfoItem>
                )
            )}
          </div>
        </div>
      )}

      {profile.debut && (
        <div>
          <h3 className="section-title">Debut</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem label="Reason">{profile.debut.reason || "-"}</InfoItem>
            <InfoItem label="Start">{profile.debut.start || "-"}</InfoItem>
            <InfoItem label="End">{profile.debut.end || "-"}</InfoItem>
          </div>
        </div>
      )}

      {profile.tags && profile.tags.length > 0 && (
        <div>
          <h3 className="section-title">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {profile.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full
                bg-gray-200 dark:bg-gray-700
                text-gray-700 dark:text-gray-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
