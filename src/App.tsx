import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

type Todos = {
  all: Todo[];
  searched: Todo[] | null;
};

// Non ho accesso a nextPage, quindi ho cambiato il tipo di home in un genererico react functional component
// Ho usato useNavigate hook per andare alla pagina del todo quando lo si clicca.
const Home: React.FC = () => {
  /**
   *  Ho unito todos e result in uno state unico, todos.all ha tutti i todo che vengono dall'API, mentre searched ha i todo che vengono filtrati, il default valore non presenta alcuna ricerca quindi ho scritto null.
   */
  const [todos, setTodos] = useState<Todos>({ all: [], searched: null });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        // aggiungo tutti i todo solo in todos.all
        setTodos((todos) => ({ ...todos, all: response }));
      })
      .catch((e) => console.error(e)); // in caso di error, lo possiamo vedere
  }, []);

  useEffect(() => {
    // filtro usando filter e ho usato toLowercase per avere sia il titolo sia l'elemento ricercato in minuscolo
    setTodos((todos) => ({
      ...todos,
      searched: search
        ? todos.all.filter((item) => {
            return item.title.toLowerCase().includes(search.toLowerCase());
          })
        : null,
    }));
  }, [search]);

  const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const navigate = useNavigate();
  const handleOnClickTodo = (id: number) => {
    navigate("/todo/" + id);
  };

  const deleteTodo =
    (todos: Todo[]) =>
    (id: number): Todo[] => {
      return todos.filter((item) => item.id !== id);
    };

  const handleOnClickDelete = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    event.stopPropagation();
    // cancella il todo se si trova sia in tutti i todo sia in searched todo
    setTodos((todos) => ({
      all: deleteTodo(todos.all)(id),
      searched: todos.searched && deleteTodo(todos.searched)(id),
    }));
  };

  console.log(search, todos);

  return (
    <div className="container">
      <div className="search-container">
        <input
          className="search"
          value={search}
          onChange={handleOnChangeInput}
          placeholder="Search todo..."
          data-testid="search"
          type="text"
        />
        <button className="btn-delete" onClick={() => setSearch("")}>
          Clear search
        </button>
      </div>
      <div className="todos" data-testid="todos">
        {(todos.searched && todos.searched.length > 0
          ? todos.searched
          : todos.all
        ).map(({ id, title, completed }) => (
          <div
            data-testid="todo"
            key={id}
            className="todo"
            onClick={() => handleOnClickTodo(id)}
          >
            {completed ? <p className="tick">✅</p> : null}
            <p>{title}</p>
            <button
              className="btn-delete"
              onClick={(event) => handleOnClickDelete(event, id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
