import { useState, useEffect } from "react";

function TodoModal({
  isOpen,
  onClose,
  quadrant,
  onSubmit,
  editTodo = null,
  existingTodos = [],
}) {
  // 今天的日期字串
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    estimatedHours: "",
    difficulty: "medium",
    drip: "do",
    description: "",
  });

  const [errors, setErrors] = useState({});

  // 當有 editTodo 時預填表單，沒有時清空表單
  useEffect(() => {
    if (editTodo) {
      setFormData({
        title: editTodo.title,
        startDate: editTodo.startDate,
        endDate: editTodo.endDate,
        estimatedHours: editTodo.estimatedHours,
        difficulty: editTodo.difficulty,
        drip: editTodo.drip,
        description: editTodo.description || "",
      });
    } else {
      setFormData({
        title: "",
        startDate: "",
        endDate: "",
        estimatedHours: "",
        difficulty: "medium",
        drip: "do",
        description: "",
      });
    }
  }, [editTodo]);

  // 處理輸入變更
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 表單驗證
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "請輸入事項名稱";
    } else {
      // ✅ 檢查是否有重複名稱
      const duplicateTodo = existingTodos.find(
        (todo) =>
          todo.title.trim().toLowerCase() ===
            formData.title.trim().toLowerCase() && todo.id !== editTodo?.id // 編輯模式時排除自己
      );

      if (duplicateTodo) {
        newErrors.title = "此象限已有相同名稱的任務";
      }
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

    if (editTodo) {
      // 編輯模式
      const updatedTodo = {
        ...editTodo,
        ...formData,
      };
      onSubmit(updatedTodo, true);
    } else {
      // 新增模式
      const newTodo = {
        id: Date.now(),
        ...formData,
        quadrant: quadrant.key,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      onSubmit(newTodo, false);
    }

    // 重置表單
    setFormData({
      title: "",
      startDate: "",
      endDate: "",
      estimatedHours: "",
      difficulty: "medium",
      drip: "do",
      description: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

//===============================================================
//===============================================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl max-h-full p-4">
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
                {editTodo ? "編輯" : "新增"} {quadrant.name} 任務
              </h3>
            </div>
             {/* 🆕 右側按鈕組 */}
  <div className="flex items-center gap-2">
    {/* 刪除按鈕 - 只在編輯模式顯示 */}
    {editTodo && (
      <button
        type="button"
        onClick={handleDeleteTodo}
        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        刪除
      </button>
    )}
    
    {/* 關閉按鈕 */}
    <button
      type="button"
      onClick={onClose}
      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center transition-all"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
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
                <div className="relative">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={30}
                    className={`bg-white border ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    } text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full p-3 transition-all`}
                    placeholder="例如：運動30分鐘"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    {formData.title.length}/30
                  </span>
                </div>
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
                  min={today}
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
                  min={today}
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

              {/* 預計時數 */}
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
                    errors.estimatedHours ? "border-red-500" : "border-gray-300"
                  } text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full p-3`}
                  placeholder=""
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
                  <option value="easy">簡單</option>
                  <option value="medium">中等</option>
                  <option value="hard">困難</option>
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
                  <option value="delegation">🧾 Delegation - 委託庶務</option>
                  <option value="replacement">🔄 Replacement - 替補任務</option>
                  <option value="investment">🌱 Investment - 投資自己</option>
                  <option value="production">🚀 Production - 向上生產</option>
                </select>
                <p className="mt-2 text-sm text-gray-600">
                  {formData.drip === "delegation" &&
                    "勇敢交給他人處理，釋放你的時間與精力。"}
                  {formData.drip === "replacement" &&
                    "需將專業但可被他人承接的工作交出去，避免成為瓶頸。"}
                  {formData.drip === "investment" &&
                    "安排時間充電、學習與培養關係，為長期成長注入能量。"}
                  {formData.drip === "production" &&
                    "重心在創造收益又能讓你充滿動力的核心工作上，形成正向循環。"}
                </p>
              </div>

              {/* 任務備註 */}
              <div className="col-span-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  任務備註
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  maxLength={200}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full p-3 transition-all resize-none"
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-400">選填</span>
                  <span
                    className={`text-xs ${
                      formData.description?.length >= 200
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.description?.length || 0}/200
                  </span>
                </div>
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
                {editTodo ? "更新任務" : "新增任務"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TodoModal;
