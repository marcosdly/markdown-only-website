import { date, object, string } from "yup";

const { fromEntries, entries, keys } = Object;

export enum FieldType {
  STRING = "string",
  DATETIME = "date",
}

export const typedFields: Record<string, FieldType> = {
  category: FieldType.STRING,
  filename: FieldType.STRING,
  description: FieldType.STRING,
  lastCommitHash: FieldType.STRING,
  shortDescription: FieldType.STRING,
  shortTitle: FieldType.STRING,
  title: FieldType.STRING,
  wholeMarkdown: FieldType.STRING,
  dateCreated: FieldType.DATETIME,
  dateLastUpdated: FieldType.DATETIME,
};

export const fields: string[] = keys(typedFields);

export function toSchemaType(type: FieldType) {
  switch (type) {
    case FieldType.DATETIME:
      return date().required();
    default:
      return string().required();
  }
}

export function toHtmlInputType(type: FieldType) {
  switch (type) {
    case FieldType.DATETIME:
      return "datetime-local";
    default:
      return "text";
  }
}

export function toFirestoreTypeName(type: FieldType) {
  switch (type) {
    case FieldType.DATETIME:
      return "timestamp";
    default:
      return "string";
  }
}

export const Schema = object(
  fromEntries(entries(typedFields).map(([key, type]) => [key, toSchemaType(type)])),
);
