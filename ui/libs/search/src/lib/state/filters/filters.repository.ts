import {createStore} from "@ngneat/elf";
import {selectAllEntities, setEntities, withEntities} from "@ngneat/elf-entities";
import {withRequestsStatus} from "@ngneat/elf-requests";
import {IFilter} from "./filters.model";
import {HashMap} from "@eosc-search-service/types";
import {ICollectionSearchMetadata, IFacetResponse, SearchState} from "../results";
import {getFqsFromUrl} from "../../utils";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class FiltersRepository {
  constructor() {
  }

  readonly store = createStore(
    {
      name: `filters-base`,
    },
    withEntities<IFilter>(),
    withRequestsStatus<'filters'>()
  );

  readonly entries$ = this.store.pipe(selectAllEntities());

  intialize(collectionsMap: HashMap<ICollectionSearchMetadata>, searchStates: HashMap<SearchState>, url: string): void {
    const filters: [ICollectionSearchMetadata<unknown>, { [facetName: string]: IFacetResponse }][] = Object.entries(searchStates)
      .filter(([key, state]) => Object.keys(state.facets).length > 0)
      .map(([key, state]) => [collectionsMap[key], state.facets]);

    const filtersTree: IFilter[] = [];
    const fqs = getFqsFromUrl(url);
    filters.forEach(([collection, facets]) => {
      Object.keys(facets)
        .filter((facet) => collection.filterToField[facet])
        .forEach((facet) => {
          const filterName = collection.filterToField[facet];
          const existingFilter = filtersTree.find(
            (filter) => filter.title === filterName
          );
          const data = facets[facet].buckets.map(({ val, count }) => ({
            name: val + '',
            value: val + '',
            count: count + '',
            filter: facet,
            isSelected: fqs.some((filter) => filter === `${facet}:"${val}"`),
          }));
          if (!existingFilter) {
            filtersTree.push({
              id: facet,
              title: filterName,
              data,
              showMore: false
            });
          } else {
            existingFilter.data.push(...data);
          }
        });
    });

    this.store.update(setEntities(filtersTree))
  }
}
