import { useParams } from "react-router-dom";

export default function Todo(): JSX.Element {
  const { id } = useParams();

  return (
    <div>
      <p>Current todo ID is : {id}</p>
    </div>
  );
}
