export interface IArticle {
  id: string;
  title: string;
  author_names: string[]; // examples: Hugo, William, Harry
  description: string[];
  journal: string; // examples: PLoS One, ChemInform
  publisher: string; // examples: Elsevier BV, Wiley
  project_titles: string; // examples: Graduate Research Fellowship Program (GRFP), Theoretical Physics
  subject: string; // examples: Computational, Computer science
  access_right: string; // example: open access
  language: string; // example: English
  published: string; // example: 2016-02-08
  rating?: number;
}
