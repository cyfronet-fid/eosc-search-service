import {ISet} from './set.model';
import {servicesCollection} from '../collections/services/services.collection';
import {
  dataCollection,
  publicationsCollection,
  softwareCollection
} from "../collections/publications/publications.collection";

export const ALL_CATALOGS_LABEL = 'All catalogs';
export const allSet: ISet = {
  title: ALL_CATALOGS_LABEL,
  breadcrumbs: [
    {
      label: 'All catalogs',
      url: '/search/all'
    },
  ],
  categories: [
    {
      id: "6d3f566f-b04f-4966-9216-3f56c16d93dc",
      count: 12,
      label: "Publish research outputs",
      filters: ["categories_ss:\"Aggregators & Integrators\""],
      level: 0,
      isLeaf: true,
    },
    {
      id: "0515290a-afd6-4075-af44-c785f3caf0ef",
      count: 12,
      label: "Process and analyse",
      filters: ["categories_ss:\"Processing & Analysis\""],
      level: 0,
      isLeaf: true,
    },
    {
      id: "7e419be4-8d1a-4133-9b4a-61d0af7819b5",
      count: 12,
      label: "Access computing resources",
      filters: ["categories_ss:\"Access physical & eInfrastructures>Compute\""],
      level: 0,
      isLeaf: true,
    },
    {
      id: "821a6034-af48-4043-a6d2-130b8ae129c3",
      count: 12,
      label: "Find instruments & equipment",
      filters: ["categories_ss:\"Access physical & eInfrastructures>Instruments & Equipment\""],
      level: 0,
    },
    {
      id: "b25e62ae-b4cc-4491-8b6a-38a61b248b39",
      count: 12,
      label: "Access research infrastructures",
      filters: ["categories_ss:\"Access physical & eInfrastructures\""],
      level: 0,
    },
    {
      id: "test-1",
      count: 12,
      label: "Nested test 1-0 level",
      filters: [],
      level: 1,
      parentId: "b25e62ae-b4cc-4491-8b6a-38a61b248b39",
      isLeaf: true,
    },
    {
      id: "test-3",
      count: 12,
      label: "Nested test 1-1 level",
      filters: [],
      level: 1,
      parentId: "821a6034-af48-4043-a6d2-130b8ae129c3",
      isLeaf: true,
    },
    {
      id: "test-4",
      count: 12,
      label: "Nested test 1-2 level",
      filters: [],
      level: 1,
      parentId: "821a6034-af48-4043-a6d2-130b8ae129c3",
      isLeaf: true,
    },
    {
      id: "test-2",
      count: 12,
      label: "Nested test 2-0 level",
      filters: [],
      parentId: "test-4",
      level: 2,
      isLeaf: true,
    },
  ],
  urlPath: 'all',
  collections: [servicesCollection, publicationsCollection, dataCollection, softwareCollection]
};
