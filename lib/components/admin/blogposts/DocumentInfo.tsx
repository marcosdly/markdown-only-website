import {
  fields,
  toFirestoreTypeName,
  toHtmlInputType,
  typedFields,
} from "../../../firebase/schema";

interface FieldProps {
  fieldName: string;
}

function Field({ fieldName }: FieldProps) {
  const fieldType = typedFields[fieldName];

  return (
    <div className="local-field-container container row">
      <input
        type="text"
        value={fieldName}
        disabled
        className="col rounded bg-dark text-white border-0"
      />
      <p className="token p-0 m-0">:</p>
      <input
        type="text"
        className="col rounded bg-dark text-info border-0"
        value={toFirestoreTypeName(fieldType)}
        disabled
      />
      <p className="token p-0 m-0">=</p>
      <input
        className="col rounded bg-dark border-1 border border-secondary text-white"
        type={toHtmlInputType(fieldType)}
      />
    </div>
  );
}

export default function DocumentInfo() {
  const components = fields.map((key) => <Field fieldName={key} />);

  return <div className="local-document-info justify-content-center">{components}</div>;
}
