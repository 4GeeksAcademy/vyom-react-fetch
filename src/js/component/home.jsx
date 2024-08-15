import React, { useEffect, useState } from "react";
import "./style.css";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const newUser = () => {
    fetch("https://playground.4geeks.com/todo/users/Vy-om", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .cath((err) => console.log(err));
  };

  const getUser = () => {
    fetch("https://playground.4geeks.com/todo/users/Vy-om", {
      method: "GET",
    })
      .then((res) => {
        if (res.status === 404) {
          newUser();
        }
        console.log(res);
        return res.json();
      })
      .then((data) => setTasks(data.todos))
      .catch((err) => console.log(err));
  };

  const newTask = (inputValue) => {
    fetch("https://playground.4geeks.com/todo/todos/Vy-om", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: inputValue,
        is_done: false,
      }),
    })
      .then((res) => res.json())
      .then((data) => getUser())
      .catch((err) => console.log(err));
  };

  const deleteTask = async (id) => {
    await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/son",
      },
    });
    getUser();
  };

  const deleteAll = async (items) => {
    const deletePromises = items.map((item) =>
      fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

    await Promise.all(deletePromises);
    getUser();
  };

  const editTask = async (id) => {
    const newText = prompt("Escribe el nuevo valor de esta tarea");
    await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: newText,
        is_done: true,
      }),
    });
    getUser();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const inputValue = e.target.newTarea.value;

    if (inputValue !== "") {
      newTask(inputValue);
      setInputValue("");
    }
  };

  const printShadow = (arr) => {
    let result =
      " rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px";
    let sum = 0;
    for (let i = 1; i <= arr.length; i++) {
      let initial = i * 10;
      sum += 10;
      result += `, ${initial}px -${initial}px 0px -2px,  rgba(0, 0, 0, 0.2) ${
        initial + 2
      }px -${initial - 2}px 5px`;
    }
    return result;
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <main
      className="text-white d-flex justify-content-center align-items-center flex-column"
      style={{
        height: "100vh",
      }}
    >
      <h1
        className="text-danger m-0 text-center"
        style={{ zIndex: 10, fontSize: "100px" }}
      >
        List
      </h1>
      <div
        className="shadow-container w-75 mx-auto rounded p-5 bg-white position-relative"
        style={{
          boxShadow: `${printShadow(tasks)}`,
          maxWidth: "900px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <input
            className=" w-100 fs-3 border-bottom"
            placeholder="que hay de nuevo viejo?🐰(escribe aqui)"
            type="text"
            style={{ border: "none", outline: "none" }}
            id="newTarea"
            autoComplete="off"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </form>
        <ul className="text-secondary mt-3 fs-3 d-flex gap-2 flex-column w-100 list-group">
          {tasks.map((task) => (
            <li
              className="li-container p-2 d-flex justify-content-between  rounded"
              key={task.id}
              id={task.id}
            >
              <p className="p-0 m-0 my-auto">{task.label}</p>
              <div className="botones">
                <button
                  onClick={() => editTask(task.id)}
                  className="btn text-success fw-bold fs-3"
                >
                  <i className="bx bxs-edit-alt text-success "></i>
                </button>

                <button
                  className="btn text-danger fw-bold fs-4"
                  onClick={() => deleteTask(task.id)}
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="d-flex justify-content-center p-3">
          <button className="btn btn-danger" onClick={() => deleteAll(tasks)}>
            Borrar toda la lista
          </button>
        </div>
        <span className="text-secondary px-2 position-absolute bottom-0 start-0 p-1">
          <span className="text-danger fw-bold">{tasks.length}</span> items
        </span>
      </div>
    </main>
  );
};

export default Home;
