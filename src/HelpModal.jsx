function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} // 防止點擊內容時關閉
      >
        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white 
                     rounded-full shadow-lg flex items-center justify-center 
                     transition-all hover:scale-110"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 說明圖片 */}
        <img 
          src="/help-guide.png" 
          alt="操作說明"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}

export default HelpModal;