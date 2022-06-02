import { IOpenAIREResult } from './publications.model';
import { IResult } from '../../state/results/results.model';
import {ICollectionSearchMetadata} from "../../state/results/results.service";
import {IHasId} from "@eosc-search-service/types";

export const openAIREResultAdapter = (
  openAIREResult: Partial<IOpenAIREResult> & IHasId,
): Partial<IResult> => ({
  id: openAIREResult.id,
  title: openAIREResult?.title?.join(' ') || '',
  description: openAIREResult?.description?.join(' ') || '',
  url: `https://explore.eosc-portal.eu/search/result?id=${openAIREResult?.id?.split("|")?.pop()}`,
  tags: [
    {
      label: 'Author names',
      value: openAIREResult.author_names || [],
      originalField: 'author_names'
    },
    {
      label: 'Published (date)',
      value: openAIREResult?.published?.pop() || '',
      originalField: 'published'
    },
    {
      label: 'Access right',
      value: openAIREResult?.bestaccessright?.pop() || '',
      originalField: 'bestaccessright'
    }
  ]
})

export const publicationsCollection: ICollectionSearchMetadata<IOpenAIREResult> = {
  type: 'Publication',
  fieldToFilter: {
    'Author names': 'author_names',
    'Published (date)': 'published',
    'Access right': 'bestaccessright',
    Publisher: 'publisher',
    Language: 'language',
  },
  queryMutator: (q: string) => q,
  filterToField: {
    publisher: 'Publisher',
    subject: 'Scientific domain',
    author_names: 'Author names',
    bestaccessright: 'Access right',
    published: 'Published (date)',
    language: 'Language',
  },
  _hash: '',
  inputAdapter: (
    openAIREResult: Partial<IOpenAIREResult> & IHasId,
  ): IResult => ({
    ...openAIREResultAdapter(openAIREResult),
    type: 'Publication',
    typeUrlPath: 'publications',
    collection: 'oag_publications',
  } as IResult),
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
    qf: ['title^50', 'author_names^30', 'publisher^30', 'bestaccessright', 'description^10'],
    collection: 'oag_publications',
  }
};

export const dataCollection = {
  ...publicationsCollection,
  type: 'Data',
  params: {
    ...publicationsCollection.params,
    collection: 'oag_datasets'
  },
  inputAdapter: (
    openAIREResult: Partial<IOpenAIREResult> & IHasId,
  ): IResult => ({
    ...openAIREResultAdapter(openAIREResult),
    type: 'Data',
    typeUrlPath: 'data',
    collection: 'oag_datasets',
  } as IResult),
}

export const softwareCollection = {
  ...publicationsCollection,
  type: 'Software',
  params: {
    ...publicationsCollection.params,
    collection: 'oag_softwares'
  },
  inputAdapter: (
    openAIREResult: Partial<IOpenAIREResult> & IHasId,
  ): IResult => ({
    ...openAIREResultAdapter(openAIREResult),
    type: 'Software',
    typeUrlPath: 'software',
    collection: 'oag_softwares',
  } as IResult),
}
