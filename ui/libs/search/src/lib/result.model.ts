export interface IResult {
  title: string;
  description: string;
  type: string;
  typeUrlPath: string;
  collection: string;
  url: string;
  tags: ITag[];
}

export interface ITag {
  label: string;
  value: string | string[];
  originalField: string;
}
