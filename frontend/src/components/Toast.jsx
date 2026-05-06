export default function Toast({ message, type = "success" }) {
  if (!message) return null;

  const tone = type === "error" ? "bg-coral text-white" : "bg-mint text-white";

  return (
    <div className={`fixed right-4 top-4 z-50 rounded-lg px-4 py-3 text-sm font-semibold shadow-soft ${tone}`}>
      {message}
    </div>
  );
}
