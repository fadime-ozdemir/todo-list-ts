import { MemoryRouter, useNavigate } from "react-router-dom";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import Home from "./App";
import React from "react";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Home component", () => {
  const mockResponse = [
    {
      userId: 1,
      id: 1,
      title: "Todo S",
      completed: false,
    },
    {
      userId: 1,
      id: 2,
      title: "Todo A",
      completed: true,
    },
  ];

  beforeEach(() => {
    jest.spyOn(global, "fetch" as any).mockResolvedValue({
      json: () => mockResponse,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render the todos component", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const todoList = await screen.findAllByTestId("todo");
    expect(todoList).toHaveLength(2);
  });

  it("should filter todos based on search input", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(async () => Promise<void>);

    const searchInput = screen.getByTestId("search");
    fireEvent.change(searchInput, {
      target: { value: "A" },
    });
    const todos = await screen.findAllByTestId("todo");

    expect(todos).toHaveLength(1);
  });
});
