import Link from "next/link";

const settingsSections = [
  {
    title: "Account",
    items: [
      { label: "Edit Profile", description: "Update your name, username, bio, and profile photo.", href: "/profile" },
      { label: "Email & Password", description: "Manage your login email and password.", href: "#" },
      { label: "Account Type", description: "Dancer, choreographer, or venue account.", href: "#" },
    ],
  },
  {
    title: "App Preferences",
    items: [
      { label: "Notifications", description: "Manage event, dance, and message alerts.", href: "/notifications" },
      { label: "Saved Dances", description: "View dances you saved for later.", href: "/profile?tab=library" },
      { label: "Appearance", description: "Theme and display preferences.", href: "#" },
    ],
  },
  {
    title: "Privacy & Safety",
    items: [
      { label: "Privacy", description: "Control who can see your profile and activity.", href: "#" },
      { label: "Blocked Accounts", description: "Manage people you blocked.", href: "#" },
      { label: "Report a Problem", description: "Send feedback or report an issue.", href: "#" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help Center", description: "Get help using LineDance.", href: "#" },
      { label: "About", description: "App version, terms, and policies.", href: "#" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#130c08] px-4 py-8 text-white md:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="mt-2 text-gray-400">
            Manage your account, preferences, privacy, and app settings.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-[#1b120f] p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-black">
              H
            </div>

            <div>
              <h2 className="text-xl font-semibold">Harrison</h2>
              <p className="text-sm text-gray-400">View and manage your account</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {settingsSections.map((section) => (
            <section
              key={section.title}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#1b120f]"
            >
              <div className="border-b border-white/10 px-5 py-4">
                <h2 className="font-semibold text-white">{section.title}</h2>
              </div>

              <div>
                {section.items.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between px-5 py-4 transition hover:bg-white/10 ${
                      index !== section.items.length - 1
                        ? "border-b border-white/10"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="mt-1 text-sm text-gray-400">
                        {item.description}
                      </p>
                    </div>

                    <span className="text-gray-500">›</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#1b120f]">
          <button className="block w-full border-b border-white/10 px-5 py-4 text-left font-medium text-red-400 transition hover:bg-red-500/10">
            Log Out
          </button>

          <button className="block w-full px-5 py-4 text-left font-medium text-red-500 transition hover:bg-red-500/10">
            Delete Account
          </button>
        </div>
      </div>
    </main>
  );
}