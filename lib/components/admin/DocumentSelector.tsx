interface DropdownProps {
  id: string;
  title: string;
}

function DropdownOption() {
  return (
    <button type="button" className="btn btn-outline-light">
      Test
    </button>
  );
}

function Dropdown({ id, title }: DropdownProps) {
  const components = Array(10).fill(<DropdownOption />);

  return (
    <div className="local-dropdown-menu-container">
      <input
        type="button"
        className="btn btn-primary mb-2 w-100"
        data-bs-toggle="collapse"
        data-bs-target={"#" + id}
        aria-expanded="false"
        aria-controls={id}
        value={title}
      />
      <div className="collapse" id={id} aria-label="Dropdown Options">
        <div className="btn-group-vertical mb-2 w-100" role="group">
          {components}
        </div>
      </div>
    </div>
  );
}

export default function DocumentSelector() {
  return (
    <>
      <div class="local-dropdown-selector">
        <Dropdown id="create" title="Create Documents" />
        <Dropdown id="update" title="Update Documents" />
      </div>
    </>
  );
}
