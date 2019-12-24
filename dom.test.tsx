import Didact from "./index";
import { fireEvent, findByText } from "@testing-library/dom";

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
