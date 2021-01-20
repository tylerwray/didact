import Didact from "./didact";
import {
  fireEvent,
  findByText,
  queryByText,
  getByText,
  wait
} from "@testing-library/dom";

afterEach(() => {
  Didact.unmount();
});

function createContainer() {
  const container = document.createElement("div");
  container.id = "root";
  return container;
}

test("can render elements", async () => {
  const container = createContainer();

  const element = <a href="https://google.com/">I'm a link</a>;

  Didact.render(element, container);

  const link = await findByText(container, "I'm a link", {}, { container });

  expect(link.getAttribute("href")).toBe("https://google.com/");
});

test("can render children", async () => {
  const container = createContainer();
  const element = (
    <p>
      <span>Hello</span>
    </p>
  );

  Didact.render(element, container);

  await findByText(container, "Hello", {}, { container });
});

test("can render text children", async () => {
  const container = createContainer();
  const element = <p>Hello</p>;

  Didact.render(element, container);

  await findByText(container, "Hello", {}, { container });
});

test("can render sibling nodes", async () => {
  const container = createContainer();
  const element = (
    <p>
      <div>I'm so divided</div>
      <b>I'm so bold</b>
    </p>
  );

  Didact.render(element, container);

  await findByText(container, "I'm so divided", {}, { container });
  await findByText(container, "I'm so bold", {}, { container });
});

test("can assign event handlers", async () => {
  const container = createContainer();
  const onClick = jest.fn();
  const element = <button onClick={onClick}>Click Me</button>;

  Didact.render(element, container);

  const button = await findByText(container, "Click Me", {}, { container });

  fireEvent.click(button);

  expect(onClick).toHaveBeenCalled();
});

test("can render function components", async () => {
  function App(props) {
    return <h1>Hiya {props.name}</h1>;
  }
  const container = createContainer();

  Didact.render(<App name="Harry" />, container);

  await findByText(container, "Hiya Harry", {}, { container });
});

test("can update components with state", async () => {
  function Counter() {
    const [state, setState] = Didact.useState(1);
    return <h1 onClick={() => setState(c => c + 1)}>Count: {state}</h1>;
  }

  const container = createContainer();

  Didact.render(<Counter />, container);

  let header = await findByText(container, "Count: 1", {}, { container });

  fireEvent.click(header);

  header = await findByText(container, "Count: 2", {}, { container });

  fireEvent.click(header);

  header = await findByText(container, "Count: 3", {}, { container });

  fireEvent.click(header);

  header = await findByText(container, "Count: 4", {}, { container });
});

test("can dynamically render components", async () => {
  function Clicker() {
    const [clicked, setClicked] = Didact.useState(false);

    return (
      <div>
        {clicked && <span>Hello Moto</span>}
        <button onClick={() => setClicked(c => !c)}>Click Me</button>
      </div>
    );
  }

  const container = createContainer();

  Didact.render(<Clicker />, container);

  await wait(() => expect(queryByText(container, "Hello Moto")).toBeNull());

  const button = await findByText(container, "Click Me", {}, { container });

  fireEvent.click(button);

  await findByText(container, "Hello Moto", {}, { container });

  fireEvent.click(button);

  await wait(() => expect(queryByText(container, "Hello Moto")).toBeNull());

  fireEvent.click(button);

  await findByText(container, "Hello Moto", {}, { container });
});

test("can dynamically render children components", async () => {
  function Child(props) {
    if (!props.show) return null;
    return <div>Hello Moto</div>;
  }

  function Clicker() {
    const [clicked, setClicked] = Didact.useState(false);

    return (
      <div>
        <Child show={clicked} />
        <button onClick={() => setClicked(c => !c)}>Click Me</button>
      </div>
    );
  }

  const container = createContainer();

  Didact.render(<Clicker />, container);

  await wait(() => expect(queryByText(container, "Hello Moto")).toBeNull());

  const button = await findByText(container, "Click Me", {}, { container });

  fireEvent.click(button);

  await findByText(container, "Hello Moto", {}, { container });

  fireEvent.click(button);

  await wait(() => expect(queryByText(container, "Hello Moto")).toBeNull());

  fireEvent.click(button);

  await findByText(container, "Hello Moto", {}, { container });
});
