import { useState, useEffect } from "react";
import TodoModal from "./TodoModal";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HelpModal from "./HelpModal";

function App() {
  const [showHelp, setShowHelp] = useState(false);
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("pokemonTodos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [completedTodos, setCompletedTodos] = useState(() => {
    const saved = localStorage.getItem("completedTodos");
    return saved ? JSON.parse(saved) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedQuadrant, setSelectedQuadrant] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  const [editTodo, setEditTodo] = useState(null);

  // 四象限定義
  const quadrants = {
    "notUrgent-important": {
      name: "重要不緊急",
      bgColor: "#FDFDBE",
      borderColor: "#EB44F7",
      position: "top-0 left-0",
      pokemon: "venusaur", // 妙蛙花
      iconPosition: "top-6 left-6",
      todoPosition: "bottom-6 right-6",
    },
    "urgent-important": {
      name: "重要且緊急",
      bgColor: "#FDFDBE",
      borderColor: "#EB44F7",
      position: "top-0 right-0",
      pokemon: "charizard", // 噴火龍
      iconPosition: "top-6 right-6",
      todoPosition: "bottom-6 left-6",
    },
    "notUrgent-notImportant": {
      name: "不緊急不重要",
      bgColor: "#FDFDBE",
      borderColor: "#EB44F7",
      position: "bottom-0 left-0",
      pokemon: "jigglypuff", // 胖丁
      iconPosition: "bottom-6 left-6",
      todoPosition: "top-6 right-6",
    },
    "urgent-notImportant": {
      name: "緊急不重要",
      bgColor: "#FDFDBE",
      borderColor: "#EB44F7",
      position: "bottom-0 right-0",
      pokemon: "blastoise", // 水箭龜
      iconPosition: "bottom-6 right-6",
      todoPosition: "top-6 left-6",
    },
  };

  useEffect(() => {
    localStorage.setItem("pokemonTodos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
  }, [completedTodos]);

  const openModal = (quadrantKey) => {
    // 檢查該象限的任務數量
    const currentTodos = todos.filter((t) => t.quadrant === quadrantKey);

    if (currentTodos.length >= 5) {
      // 使用 toast 替換 alert
      toast.error(`${quadrants[quadrantKey].name} 已達上限（5個任務）！`, {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setSelectedQuadrant({
      key: quadrantKey,
      ...quadrants[quadrantKey],
    });
    setShowModal(true);
  };

  // ✅ 新增：打開編輯 Modal
  const openEditModal = (todo) => {
    setEditTodo(todo);
    setSelectedQuadrant({
      key: todo.quadrant,
      ...quadrants[todo.quadrant],
    });
    setShowModal(true);
  };

  // ✅ 處理新增和編輯
  const handleAddTodo = (todoData, isEdit) => {
    if (isEdit) {
      // 編輯模式：更新現有任務
      setTodos(todos.map((t) => (t.id === todoData.id ? todoData : t)));
    } else {
      // 新增模式：添加新任務
      setTodos([...todos, todoData]);
    }
  };
  // 刪除任務
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };
  const completeTodo = (id) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      setCompletedTodos([
        ...completedTodos,
        { ...todo, completedDate: new Date().toISOString() },
      ]);
      setTodos(todos.filter((t) => t.id !== id));
    }
  };
  // ✅ 確認完成toast
  const handleCompleteTodo = (id, title) => {
    toast.info(
      <div className="w-full sm:w-auto">
        <p className="font-bold mb-2">很好!你已經完成任務了嗎？</p>
        <p className="text-lg text-blue-600/100 mb-4">{title}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              completeTodo(id);
              toast.dismiss();
              toast.success("任務已完成！", {
                position: "top-center",
                autoClose: 2500,
                toastId: "task-completed",
                icon: () => (
                  <img src="/pokeball.webp" alt="完成" className="w-6 h-6" />
                ),
              });
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium"
          >
            確認
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm font-medium"
          >
            取消
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        icon: false,
        toastId: `complete-confirm-${id}`,
      }
    );
  };
  // ✅ 新增：關閉 Modal 時清空 editTodo
  const closeModal = () => {
    setShowModal(false);
    setEditTodo(null);
  };

  //清空歷史紀錄
  const handleClearHistory = () => {
    const toastId = "clear-history-confirm";
    if (toast.isActive(toastId)) {
      return;
    } //check
    toast.warning(
      <div className="p-2 w-[280px]">
        <p className="font-bold mb-2">是否要清除所有紀錄？</p>
        <p className="text-sm text-gray-600 mb-4">刪除後無法復原！</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              setCompletedTodos([]);
              toast.dismiss();
              toast.success("歷史紀錄已清空", {
                position: "top-center",
                autoClose: 2000,
              });
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
          >
            確認清空
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm font-medium"
          >
            取消
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        icon: false,
        toastId: toastId,
      }
    );
  };
  // =====================================================================
  // =====================================================================
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 "
      style={{
        backgroundImage: "url('/bg-pokemon.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* 玻璃遮罩 */}
      <div className="fixed inset-0 bg-gradient-to-br from-white/30 to-blue-50/30 backdrop-blur-xs"></div>
      {/* 主容器*/}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="relative mb-10 mt-8 px-12">
        {/* 標題 */}
        <h1 className="text-4xl font-bold text-center text-gray-800">
          <span className="inline-flex items-center justify-center gap-4">
            <img
              src="/trophy.png"
              alt="trophy"
              className="w-8 h-8 hover:scale-110 transition-all"
            />
            <span>時間管理大師</span>
            <img
              src="/trophy.png"
              alt="trophy"
              className="w-8 h-8 hover:scale-110 transition-all"
            />
          </span>
        </h1>

        {/* 操作說明按鈕 */}
        <button
          onClick={() => setShowHelp(true)}
          className="absolute top-0 right-2 sm:right-4 
                   w-9 h-9 sm:w-10 sm:h-10 rounded-full 
                   bg-white/80 backdrop-blur-sm shadow-lg
                   hover:bg-white hover:scale-110
                   flex items-center justify-center transition-all
                   border-2 border-purple-300"
        >
          <span className="text-purple-600 font-bold text-xl">?</span>
        </button>
        </div>

        {/* Help Modal */}
        <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

        {/* 🆕 裝飾條 */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-5">
            <img
              src="/pikachu.webp"
              className="w-8 h-8 animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <img
              src="/pokeball.webp"
              className="w-8 h-8 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
            <img
              src="/pikachu.webp"
              className="w-8 h-8 animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <img
              src="/pokeball.webp"
              className="w-8 h-8 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
            <img
              src="/pikachu.webp"
              className="w-8 h-8 animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
          </div>
        </div>
        {/* 四象限容器 */}
        <div className="w-full mb-8">
          {/* 📱 手機版：垂直排列 */}
          <div className="sm:hidden space-y-4 px-4">
            {Object.entries(quadrants).map(([key, quadrant]) => (
              <div
                key={key}
                className="rounded-[50px] border-[2px] shadow-2xl p-6 relative"
                style={{
                  backgroundColor: quadrant.bgColor,
                  borderColor: quadrant.borderColor,
                  minHeight: "180px",
                }}
              >
                {/* 動物圖示 */}
                <div className="absolute top-5 left-5 cursor-pointer hover:scale-110 transition-all duration-300">
                  <div
                    className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex items-center justify-center shadow-lg"
                    onClick={() => openModal(key)}
                  >
                    <img
                      src={`/${quadrant.pokemon}.png`}
                      alt={quadrant.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* 任務數量 */}
                <div className="absolute top-5 right-5">
                  <div className="bg-white bg-opacity-70 rounded-full px-3 py-1.5 shadow-md">
                    <span className="font-bold text-gray-700 text-sm">
                      {todos.filter((t) => t.quadrant === key).length} 項任務
                    </span>
                  </div>
                </div>

                {/* 任務列表 */}
                <div className="mt-20 space-y-2">
                  {todos
                    .filter((t) => t.quadrant === key)
                    .slice(0, 5)
                    .map((todo) => (
                      <div
                        key={todo.id}
                        className="bg-white bg-opacity-70 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-sm hover:bg-opacity-90 hover:shadow-md transition-all"
                      >
                        <div
                          onClick={() => openEditModal(todo)}
                          className="flex-1 text-sm font-bold text-gray-700 truncate cursor-pointer"
                        >
                          {todo.title}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompleteTodo(todo.id, todo.title);
                          }}
                          className="flex-shrink-0 w-7 h-7 hover:scale-110 transition-transform"
                        >
                          <img
                            src="/complete-icon.png"
                            alt="完成"
                            className="w-full h-full object-contain"
                          />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* 💻 桌面版：保持原樣的 2x2 網格 */}
          <div
            className="hidden sm:block relative w-full"
            style={{ paddingBottom: "60%" }}
          >
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-6">
              {Object.entries(quadrants).map(([key, quadrant]) => (
                <div
                  key={key}
                  className={`
            ${quadrant.position}
            flex flex-col
            rounded-[50px]
            border-[2px]
            shadow-2xl
            p-8
            transition-all 
            duration-300
            relative
            overflow-hidden
          `}
                  style={{
                    backgroundColor: quadrant.bgColor,
                    borderColor: quadrant.borderColor,
                  }}
                >
                  {/* 寶可夢圖示*/}
                  <div
                    className={`absolute ${quadrant.iconPosition} cursor-pointer hover:scale-110 transition-all duration-300`}
                  >
                    <div
                      className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex items-center justify-center text-5xl shadow-lg"
                      onClick={() => openModal(key)}
                    >
                      <img
                        src={`/${quadrant.pokemon}.png`}
                        alt={quadrant.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Todo 數量*/}
                  <div className={`absolute ${quadrant.todoPosition}`}>
                    <div className="bg-white bg-opacity-70 rounded-full px-5 py-3 shadow-md">
                      <span className="font-bold text-gray-700 text-lg">
                        {todos.filter((t) => t.quadrant === key).length} 項任務
                      </span>
                    </div>
                  </div>

                  {/* Todo 列表預覽 */}
                  <div className="flex-1 flex items-center justify-center pt-3 pb-10">
                    <div className="space-y-2 w-80">
                      {todos
                        .filter((t) => t.quadrant === key)
                        .slice(0, 5)
                        .map((todo) => (
                          <div
                            key={todo.id}
                            className="bg-white bg-opacity-70 rounded-xl p-3 text-base font-bold text-gray-700 shadow-sm 
                    truncate cursor-pointer hover:bg-opacity-90 hover:shadow-md transition-all flex items-center justify-between gap-3"
                          >
                            {/* 任務標題 */}
                            <div
                              onClick={() => openEditModal(todo)}
                              className="flex-1 text-base font-bold text-gray-700 truncate cursor-pointer"
                            >
                              {todo.title}
                            </div>

                            {/* 完成按鈕 */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompleteTodo(todo.id, todo.title);
                              }}
                              className="flex-shrink-0 w-8 h-8 hover:scale-110 transition-transform"
                            >
                              <img
                                src="/complete-icon.png"
                                alt="完成"
                                className="w-full h-full object-contain"
                              />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 💻 桌面版中間的金魚球 */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-all duration-300 z-20"
              onClick={() => setShowArchive(!showArchive)}
              style={{
                width: "14%",
                paddingBottom: "14%",
              }}
            >
              <img
                src="/ULTRA_BALL.webp"
                alt="高級球"
                className="absolute inset-0 w-full h-full object-contain rounded-full shadow-2xl"
                style={{
                  filter: "drop-shadow(0 44px 4px rgba(0, 0, 0, 0.25))",
                }}
              />
            </div>
          </div>
        </div>
        {/* 結束四象限容器 */}

        {/* 📱 手機版：金魚球在 Footer 上方 */}
        <div className="sm:hidden flex justify-center my-6">
          <div
            className="w-20 h-20 cursor-pointer hover:scale-110 transition-all duration-300"
            onClick={() => setShowArchive(!showArchive)}
          >
            <img
              src="/ULTRA_BALL.webp"
              alt="歷史紀錄"
              className="w-full h-full object-contain rounded-full shadow-2xl"
              style={{
                filter: "drop-shadow(0 8px 8px rgba(0, 0, 0, 0.25))",
              }}
            />
          </div>
        </div>
      </div>

      {/* 🆕 Footer - 版權聲明 */}
      <footer className="relative z-10 text-center py-4 mt-8">
        <p className="text-lg font-bold text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
          每天都進步些許，積沙成塔、聚少成多，
          <br className="sm:hidden" />
          一起往目標大步邁進!
        </p>
      </footer>

      {/* Modal*/}
      {showModal && (
        <TodoModal
          isOpen={showModal}
          onClose={closeModal}
          quadrant={selectedQuadrant}
          onSubmit={handleAddTodo}
          onDelete={handleDeleteTodo}
          editTodo={editTodo}
          existingTodos={todos.filter(
            (t) => t.quadrant === selectedQuadrant?.key
          )}
        />
      )}

      {/* Archive Modal（待完成）*/}
      {showArchive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            {/* 標題列 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">歷史紀錄</h2>

              {/* 🆕 右上角清除按鈕 */}
              {completedTodos.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  🗑️ 清空紀錄
                </button>
              )}
            </div>

            {completedTodos.length === 0 ? (
              <p className="text-gray-500 text-center py-12 text-xl">
                目前還沒有完成的任務
              </p>
            ) : (
              <div className="space-y-4">
                {completedTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="bg-gray-50 rounded-xl p-6 border-l-4 border-green-500 flex"
                  >
                    {/* 🆕 寶可夢圖示 */}
                    <div className="flex-shrink-0">
                      <img
                        src={`/${quadrants[todo.quadrant].pokemon}.png`}
                        alt={quadrants[todo.quadrant].name}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    {/* 任務資訊 */}
                    <div className="flex-1 pl-4">
                      <h3 className="font-bold text-xl mb-2">{todo.title}</h3>
                      <p className="text-sm text-gray-600">
                        完成日期:{" "}
                        {new Date(todo.completedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowArchive(false)}
              className="mt-6 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700"
            >
              關閉
            </button>
          </div>
        </div>
      )}

      {/* ToastContainer 放在這裡，整個 App 的最底部 */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}

export default App;
