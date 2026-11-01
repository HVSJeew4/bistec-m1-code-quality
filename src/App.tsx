import { useState, ChangeEvent } from "react";
import { Button } from "./components/Button/Button";
import { Input } from "./components/Input/Input";
import { Modal } from "./components/Modal/Modal";
import { Card } from "./components/Card/Card";
import { Dropdown } from "./components/Dropdown/Dropdown";
import { Toggle } from "./components/Toggle/Toggle";
import { Alert } from "./components/Alert/Alert";
import { Tabs } from "./components/Tabs/Tabs";

const dropdownItems = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
];

const tabItems = [
  { label: "Overview", content: <p>This is the overview tab content.</p> },
  { label: "Features", content: <p>This is the features tab content.</p> },
  { label: "Pricing", content: <p>This is the pricing tab content.</p> },
];

export function App() {
  const [inputValue, setInputValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState<string>();
  const [toggleChecked, setToggleChecked] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Hearts Component Library</h1>
        <p>8 components &middot; 0% test coverage &middot; 5 hidden bugs</p>
      </header>

      <main className="app-main">
        {/* Button */}
        <section className="demo-section">
          <h2>Button</h2>
          <div className="demo-row">
            <Button onClick={() => setClickCount((c) => c + 1)}>
              Primary (clicked {clickCount}x)
            </Button>
            <Button variant="secondary" onClick={() => alert("Secondary!")}>
              Secondary
            </Button>
            <Button variant="danger" onClick={() => alert("Danger!")}>
              Danger
            </Button>
            <Button disabled onClick={() => alert("Should not fire!")}>
              Disabled
            </Button>
            <Button loading>Saving...</Button>
          </div>
        </section>

        {/* Input */}
        <section className="demo-section">
          <h2>Input</h2>
          <div className="demo-row">
            <Input
              label="Name"
              placeholder="Enter your name"
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
              error={inputValue === "" ? "Name is required" : undefined}
            />
          </div>
        </section>

        {/* Modal */}
        <section className="demo-section">
          <h2>Modal</h2>
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Example Modal"
          >
            <p>This is the modal content. Press Escape or click outside to close.</p>
          </Modal>
        </section>

        {/* Card */}
        <section className="demo-section">
          <h2>Card</h2>
          <div className="demo-row">
            <Card
              title="Getting Started"
              actions={<Button variant="secondary">Learn More</Button>}
            >
              <p>Set up your development environment and write your first test.</p>
            </Card>
            <Card title="Best Practices">
              <p>Follow testing best practices for reliable, maintainable tests.</p>
            </Card>
          </div>
        </section>

        {/* Dropdown */}
        <section className="demo-section">
          <h2>Dropdown</h2>
          <Dropdown
            label="Framework"
            items={dropdownItems}
            value={dropdownValue}
            onChange={setDropdownValue}
            placeholder="Choose a framework..."
          />
          {dropdownValue && <p>Selected: {dropdownValue}</p>}
        </section>

        {/* Toggle */}
        <section className="demo-section">
          <h2>Toggle</h2>
          <div className="demo-row">
            <Toggle
              label="Dark mode"
              checked={toggleChecked}
              onChange={setToggleChecked}
            />
            <Toggle label="Disabled toggle" disabled />
          </div>
          <p>Dark mode: {toggleChecked ? "ON" : "OFF"}</p>
        </section>

        {/* Alert */}
        <section className="demo-section">
          <h2>Alert</h2>
          <div className="demo-column">
            <Alert variant="info">This is an informational message.</Alert>
            <Alert variant="success" dismissible>
              Operation completed successfully!
            </Alert>
            <Alert variant="warning">Please review your input.</Alert>
            <Alert variant="error" dismissible>
              Something went wrong. Please try again.
            </Alert>
          </div>
        </section>

        {/* Tabs */}
        <section className="demo-section">
          <h2>Tabs</h2>
          <Tabs tabs={tabItems} onChange={(i) => console.log("Tab index:", i)} />
        </section>
      </main>
    </div>
  );
}
