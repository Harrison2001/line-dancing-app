import UploadForm from "@/components/UploadButton";

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-[#130c08] px-4 py-6 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold">Upload</h1>
        <p className="mb-6 text-sm text-white/60">
          Share a dance video, tutorial, or event flyer.
        </p>

        <UploadForm />
      </div>
    </main>
  );
}