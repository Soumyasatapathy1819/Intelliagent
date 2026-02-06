export default function Sidebar({
  open,
  onClose,
  chats,
  activeChatId,
  onSelect,
  onNewChat,
  onDelete
}) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity md:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed md:static inset-y-0 left-0 w-72 bg-panel/90 border-r border-slate-800/70 backdrop-blur p-5 flex flex-col gap-4 transform transition-transform ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">IntelliAgent</h1>
            <p className="text-xs text-slate-400">Multimodal Workspace</p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-slate-400"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <button
          onClick={onNewChat}
          className="bg-accent text-slate-900 py-2 rounded-xl font-semibold shadow-glow"
        >
          + New Chat
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {chats.length === 0 && (
            <div className="text-sm text-slate-500">No chats yet.</div>
          )}

          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 border ${
                activeChatId === chat._id
                  ? "border-accent text-white"
                  : "border-slate-800 text-slate-300"
              }`}
            >
              <button
                onClick={() => onSelect(chat._id)}
                className="flex-1 text-left"
              >
                <div className="text-sm font-medium truncate">
                  {chat.title || "Untitled Chat"}
                </div>
                {chat.lastMessageAt && (
                  <div className="text-xs text-slate-500">
                    {new Date(chat.lastMessageAt).toLocaleDateString()}
                  </div>
                )}
              </button>
              <button
                onClick={() => onDelete(chat._id)}
                className="text-xs text-slate-500 hover:text-red-400"
                aria-label="Delete chat"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
