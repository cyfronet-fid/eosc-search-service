import { IArticle } from './publications.model';
import { IResult } from '../../state/results/results.model';
import {ICollectionSearchMetadata} from "../../state/results/results.service";
import {IHasId} from "@eosc-search-service/types";

export const publicationAdapter = (
  publication: Partial<IArticle> & IHasId,
): IResult => ({
  id: publication.id,
  title: publication?.title?.join(' ') || '',
  description: publication?.description?.join(' ') || '',
  type: 'Publication',
  typeUrlPath: 'publications',
  collection: 'oag_researchoutcomes_prod_20211208_v2',
  url: `https://explore.eosc-portal.eu/search/result?id=${publication?.id?.split("|")?.pop()}`,
  tags: [
    {
      label: 'Author names',
      value: publication.author_names || [],
      originalField: 'author_names'
    },
    {
      label: 'Published (date)',
      value: publication?.published?.pop() || '',
      originalField: 'published'
    },
    {
      label: 'Access right',
      value: publication?.bestaccessright?.pop() || '',
      originalField: 'bestaccessright'
    }
  ]
})

export const publicationsCollection: ICollectionSearchMetadata<IArticle> = {
  type: 'Research Product',
  fieldToFilter: {
    'Author names': 'author_names',
    'Published (date)': 'published',
    'Access right': 'bestaccessright',
    Provider: 'publisher',
  },
  filterToField: {
    publisher: 'Provider',
    subject: 'Scientific domain',
    author_names: 'Author names',
    bestaccessright: 'Access right',
    published: 'Published (date)',
  },
  _hash: '',
  inputAdapter: publicationAdapter,
  facets: {
    subject: { field: 'subject', type: 'terms' },
    publisher: { field: 'publisher', type: 'terms' },
    bestaccessright: { field: 'bestaccessright', type: 'terms' },
    language: { field: 'language', type: 'terms' },
    journal: { field: 'journal', type: 'terms' },
    organization_names: { field: 'organization_names', type: 'terms' },
    project_titles: { field: 'project_titles', type: 'terms' },
  },
  params: {
    qf: ['title', 'author_names', 'publisher', 'bestaccessright', 'published'],
    collection: 'oag_researchoutcomes_prod_20211208_v2',
  }
};

export const dataCollection = {
  ...publicationsCollection,
  type: 'Data',
  params: {
    ...publicationsCollection.params,
    collection: 'oag_datasets'
  }
}

export const softwareCollection = {
  ...publicationsCollection,
  type: 'Software',
  params: {
    ...publicationsCollection.params,
    collection: 'oag_sotfwares'
  }
}
