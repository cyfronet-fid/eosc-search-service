export interface IResult {
  title: string;
  description: string;
  type: string;
  typeUrlPath: string;
  fieldToFilter: { [field: string]: string };
  collection: string;
  url: string;
  fieldsToTags: string[];
  [tagName: string]: string | string[] | any | any[];
}

export interface ITag {
  type: string;
  value: string | string[];
  originalField: string;
}
