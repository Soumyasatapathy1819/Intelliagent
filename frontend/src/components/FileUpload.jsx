export default function FileUpload({ label, accept, onFile }) {
  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onFile?.(file);
    event.target.value = "";
  };

  return (
    <label className="cursor-pointer border border-slate-700 text-slate-300 px-3 py-2 rounded-full text-sm hover:border-slate-500">
      {label}
      <input type="file" hidden accept={accept} onChange={handleUpload} />
    </label>
  );
}
