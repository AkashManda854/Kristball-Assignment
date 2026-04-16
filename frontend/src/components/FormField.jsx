export default function FormField({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-sand/75">{label}</span>
      {children}
    </label>
  );
}
