import { useState, useEffect } from "react";
import TodoModal from "./TodoModal";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
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
      todoPosition: "bottom-6 left-6",
    },
    "urgent-important": {
      name: "重要且緊急",
      bgColor: "#FDFDBE",
      borderColor: "#EB44F7",
      position: "top-0 right-0",
      pokemon: "charizard", // 噴火龍
      iconPosition: "top-6 right-6",
      todoPosition: "bottom-6 right-6",
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

  // ✅ 修改：處理新增和編輯
const handleAddTodo = (todoData, isEdit) => {
  if (isEdit) {
    // 編輯模式：更新現有任務
    setTodos(todos.map(t => t.id === todoData.id ? todoData : t));
  } else {
    // 新增模式：添加新任務
    setTodos([...todos, todoData]);
  }
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
  // ✅ 新增：關閉 Modal 時清空 editTodo
  const closeModal = () => {
  setShowModal(false);
  setEditTodo(null);
};

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 "
      style={{
        backgroundImage: "url('/bg-pokemon.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* 玻璃遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-blue-50/30 backdrop-blur-sm"></div>
      {/* 主容器*/}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* 標題 */}
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          ⚡ 寶可夢時間管理大師 ⚡
        </h1>

        {/* 四象限容器 */}
        <div className="relative w-full" style={{ paddingBottom: "60%" }}>
          {/* 四象限 Grid */}
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
                {/* 寶可夢圖示（右上角）*/}
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

                {/* 區塊標題（左下角）
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-3xl font-bold text-gray-800">
                    {quadrant.name}
                  </h3>
                </div> */}

                {/* Todo 數量*/}
                <div className={`absolute ${quadrant.todoPosition}`}>
                  <div className="bg-white bg-opacity-70 rounded-full px-5 py-3 shadow-md">
                    <span className="font-bold text-gray-700 text-lg">
                      {todos.filter((t) => t.quadrant === key).length} 項任務
                    </span>
                  </div>
                </div>

                {/* Todo 列表預覽 */}
                <div className="flex-1 flex items-center justify-center p-12">
                  <div className="space-y-2 w-80">
                    {todos
                      .filter((t) => t.quadrant === key)
                      .slice(0, 5)
                      .map((todo) => (
                        <div
                          key={todo.id}
                          onClick={() => openEditModal(todo)}
                          className="bg-white bg-opacity-70 rounded-xl p-3 text-base font-medium text-gray-700 shadow-sm 
                          truncate cursor-pointer hover:bg-opacity-90 hover:shadow-md transition-all"
                        >
                          {todo.title}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 中間高級球 - 根據原始尺寸 718x718 */}
          <div
            className="
              absolute 
              top-1/2 left-1/2 
              transform -translate-x-1/2 -translate-y-1/2
              cursor-pointer
              hover:scale-110 
              transition-all 
              duration-300
              z-20
            "
            onClick={() => setShowArchive(!showArchive)}
            style={{
              width: "12%",
              paddingBottom: "12%",
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

          {/* Hover 提示 */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
            <div className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
              點擊查看歷史紀錄
            </div>
          </div>
        </div>
      </div>

      {/* Modal*/}
      {showModal && (
        <TodoModal
          isOpen={showModal}
          onClose={closeModal}
          quadrant={selectedQuadrant}
          onSubmit={handleAddTodo}
          editTodo={editTodo} 
          existingTodos={todos.filter(t => t.quadrant === selectedQuadrant?.key)}
        />
      )}

      {/* Archive Modal（待完成）*/}
      {showArchive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-6">歷史紀錄</h2>

            {completedTodos.length === 0 ? (
              <p className="text-gray-500 text-center py-12 text-xl">
                目前還沒有完成的任務
              </p>
            ) : (
              <div className="space-y-4">
                {completedTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="bg-gray-50 rounded-xl p-6 border-l-4 border-green-500"
                  >
                    <h3 className="font-bold text-xl mb-2">{todo.title}</h3>
                    <p className="text-sm text-gray-600">
                      完成日期:{" "}
                      {new Date(todo.completedDate).toLocaleDateString()}
                    </p>
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
