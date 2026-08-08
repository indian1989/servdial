// src/components/common/LoginPromptModal.jsx

const LoginPromptModal = ({ open, onClose, onLogin }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
        <div className="text-4xl mb-3">🔐</div>

        <h2 className="text-xl font-bold mb-2">
          Login Required
        </h2>

        <p className="text-sm text-gray-600 mb-5">
          Please login to continue.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={onLogin}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;