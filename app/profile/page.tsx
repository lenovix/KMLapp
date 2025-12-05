import PlatformActions from "@/components/Home/PlatformActionsHome";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Profile & Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Profile - mengambil 3 kolom */}
        <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Ichsanul Kamil Sudarmi
              </p>
              <p className="text-gray-500 dark:text-gray-300">
                ichkmlsdr@gmail.com
              </p>
            </div>
          </div>

          <div>
            <p className="text-gray-700 dark:text-gray-300">
              This is your profile section. You can update your personal info
              here.
            </p>
          </div>
        </div>

        {/* Settings - mengambil 1 kolom */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Settings
          </h2>

          <PlatformActions
            platform="Comicfy"
            actions={[
              "Delete Comment",
              "Delete Favorite",
              "Delete Comic",
              "Delete Tmp_Folder",
            ]}
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

          {/* Save Settings */}
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
