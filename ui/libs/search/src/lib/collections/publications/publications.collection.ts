import { CollectionSearchMetadata } from '../collection.model';
import { PUBLICATIONS_FACETS } from '../../services/search-service/facet-param.interface';
import { IArticle } from './publications.model';
import { IResult } from '../../result.model';
import {SolrQueryParams} from "../../services/search";

export const publicationsCollection = new CollectionSearchMetadata(
  new SolrQueryParams({
    qf: ['title', 'author_names', 'publisher', 'bestaccessright', 'published'],
    collection: 'oag_researchoutcomes_prod_20211208_v2',
  }),
  PUBLICATIONS_FACETS,
  (
    publication: Partial<IArticle>,
  ): IResult => ({
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
  }),
  {
    'Author names': 'author_names',
    'Published (date)': 'published',
    'Access right': 'bestaccessright',
    Provider: 'publisher',
  },
  {
    publisher: 'Provider',
    subject: 'Scientific domain',
    author_names: 'Author names',
    bestaccessright: 'Access right',
    published: 'Published (date)',
  },
  'Publication'
);
