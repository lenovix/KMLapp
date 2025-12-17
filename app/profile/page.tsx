import PlatformActions from "@/components/Home/PlatformActionsHome";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Profile & Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Profile */}
        <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Ichsanul Kamil Sudarmi
              </p>
              <p className="text-gray-500 dark:text-gray-300">
                ichkmlsdr@gmail.com
              </p>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300">
            This is your profile section. You can update your personal info
            here.
          </p>
        </div>

        {/* Settings */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Settings
          </h2>

          <PlatformActions
            platform="Komify"
            actions={["Delete Comic", "Delete Comic Cache"]}
          />

          <PlatformActions
            platform="Filmfy"
            actions={[
              "Delete Comment",
              "Delete Favorite",
              "Delete Film",
              "Delete Tmp_Folder",
            ]}
          />

          <PlatformActions
            platform="Animefy"
            actions={[
              "Delete Comment",
              "Delete Favorite",
              "Delete Anime",
              "Delete Tmp_Folder",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
