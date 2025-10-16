import { useState } from "react";

function TodoModal({ isOpen, onClose, quadrant, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    estimatedHours: "",
    difficulty: "medium",
    drip: "do",
  });

  const [errors, setErrors] = useState({});

  // 處理輸入變更
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 清除該欄位的錯誤
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 表單驗證
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "請輸入事項名稱";
    }

    if (!formData.startDate) {
      newErrors.startDate = "請選擇開始日期";
    }

    if (!formData.endDate) {
      newErrors.endDate = "請選擇結束日期";
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = "結束日期不能早於開始日期";
      }
    }

    if (!formData.estimatedHours || formData.estimatedHours <= 0) {
      newErrors.estimatedHours = "請輸入預計時數（需大於 0）";
    }

    return newErrors;
  };

  // 提交表單
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 建立新的 Todo
    const newTodo = {
      id: Date.now(),
      ...formData,
      quadrant: quadrant.key,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newTodo);

    // 重置表單
    setFormData({
      title: "",
      startDate: "",
      endDate: "",
      estimatedHours: "",
      difficulty: "medium",
      drip: "do",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl max-h-full p-4">
        {/* Modal content */}
        <div
          className="relative bg-white rounded-3xl shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${quadrant.bgColor} 0%, #ffffff 100%)`,
          }}
        >
          {/* Modal header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 rounded-t">
            <div className="flex items-center gap-4">
              <img
                src={`/${quadrant.pokemon}.png`}
                alt={quadrant.name}
                className="w-12 h-12 object-contain"
              />
              <h3 className="text-2xl font-bold text-gray-900">
                新增 {quadrant.name} 任務
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal body */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid gap-6 mb-6 grid-cols-2">
              {/* 事項名稱 */}
              <div className="col-span-2">
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  事項名稱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`bg-white border ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full p-3 transition-all`}
                  placeholder="例如：準備技術面試"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* 開始日期 */}
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="startDate"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  開始日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`bg-white border ${
                    errors.startDate ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full p-3`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.startDate}
                  </p>
                )}
              </div>

              {/* 結束日期 */}
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="endDate"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  結束日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`bg-white border ${
                    errors.endDate ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full p-3`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>

              {/* 預計完成時間 */}
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="estimatedHours"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  預計時數 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="estimatedHours"
                  id="estimatedHours"
                  value={formData.estimatedHours}
                  onChange={handleChange}
                  min="0.5"
                  step="0.5"
                  className={`bg-white border ${
                    errors.estimatedHours
                      ? "border-red-500"
                      : "border-gray-300"
                  } text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full p-3`}
                  placeholder="10"
                />
                {errors.estimatedHours && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.estimatedHours}
                  </p>
                )}
              </div>

              {/* 難易度 */}
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="difficulty"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  難易度
                </label>
                <select
                  name="difficulty"
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
                >
                  <option value="easy">😊 簡單</option>
                  <option value="medium">😐 中等</option>
                  <option value="hard">😰 困難</option>
                </select>
              </div>

              {/* DRIP */}
              <div className="col-span-2">
                <label
                  htmlFor="drip"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  DRIP 性質
                </label>
                <select
                  name="drip"
                  id="drip"
                  value={formData.drip}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
                >
                  <option value="do">✅ Do - 立即執行</option>
                  <option value="reduce">⬇️ Reduce - 減少投入</option>
                  <option value="ignore">🚫 Ignore - 可以忽略</option>
                  <option value="plan">📅 Plan - 需要規劃</option>
                </select>
                <p className="mt-2 text-sm text-gray-600">
                  {formData.drip === "do" &&
                    "這是必須立即處理的重要任務"}
                  {formData.drip === "reduce" &&
                    "可以減少投入的時間和精力"}
                  {formData.drip === "ignore" && "不重要的事項，可以忽略"}
                  {formData.drip === "plan" && "需要仔細規劃的未來任務"}
                </p>
              </div>
            </div>

            {/* 按鈕 */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold transition-all"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg inline-flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                新增任務
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TodoModal;