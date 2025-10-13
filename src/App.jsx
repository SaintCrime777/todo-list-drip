import { useEffect, useState} from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      return JSON.parse(savedTodos);
    } else {
      return [
        { id: 1, text: "學習硬技術", completed: false },
        { id: 2, text: "運動-重訓", completed: true },
        { id: 3, text: "寄履歷", completed: false },
      ];
    }
  });

  const [inputValue, setInputValue] = useState("");

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]); //監聽todos

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const addTodo = () => {
    if (inputValue.trim() === "") {
      alert("請輸入待辦事項！");
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  // 刪除 todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  //篩選filter
  const getFilterTodo = () => {
    if (filter === "active") {
      return todos.filter((todo) => !todo.completed);
    }
    if (filter === "completed") {
      return todos.filter((todo) => todo.completed);
    }
    return todos;
  };
  const filteredTodo = getFilterTodo();

  return (
    <div className="app">
      <h1>📝 My Todo List</h1>

      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="輸入新的待辦事項..."
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
        />
        <button onClick={addTodo}>➕ 新增</button>
      </div>
      {/* 新增：篩選按鈕 */}
      <div style={{ margin: "20px 0" }}>
        <button
          onClick={() => setFilter("all")}
          style={{ fontWeight: filter === "all" ? "bold" : "normal" }}
        >
          全部 ({todos.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          style={{ fontWeight: filter === "active" ? "bold" : "normal" }}
        >
          進行中 ({todos.filter((t) => !t.completed).length})
        </button>
        <button
          onClick={() => setFilter("completed")}
          style={{ fontWeight: filter === "completed" ? "bold" : "normal" }}
        >
          已完成 ({todos.filter((t) => t.completed).length})
        </button>
      </div>

      <p>目前有 {todos.length} 個待辦事項</p>

      <ul>
        {filteredTodo.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.text}
            </span>
            {/* 新增刪除按鈕 */}
            <button onClick={() => deleteTodo(todo.id)}>🗑️ 刪除</button>
          </li>
        ))}
      </ul>
      {/* 新增：空狀態提示 */}
      {filteredTodo.length === 0 && (
        <p style={{ color: "#999", textAlign: "center" }}>
          {filter === "active" && "🎉 太棒了！沒有待辦事項"}
          {filter === "completed" && "還沒有完成的事項"}
          {filter === "all" && "目前沒有任何待辦事項"}
        </p>
      )}
    </div>
  );
}

export default App;
