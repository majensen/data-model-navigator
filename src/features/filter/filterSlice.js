import { createSlice, createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';

import {
  facetSectionProps,
  facetFilters,
  filterConfig,
  controlVocabConfig,
} from "../../components/ModelNavigator/config/nav.config";

let acc = {};

facetFilters.flatMap(
    (filt) => {
      filt.checkboxItems.map((item) => {
        acc[`checkbox_${item.tag}_${item.value}`] = false;
      });
    });

const initialState = {
  model: {},
  configs: {filterConfig, controlVocabConfig},
  hiddenNodes: [],
  allTaggedNodes: [],
  fullTagMatrix: {},
  displayedTagMatrix: {},
  checkboxState: acc,
  facetFilters,
  filtersSelected: [],
};

const defaultFilterConfig = {
  facetFilters: [],
  facetSectionProps: {},
  resetIcon: {},
  baseFilters: {},
  filterSections: [],
  filterOptions: []
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    configsLoaded(state, action) {
      // configs is { pageConfig, readmeConfig, graphViewConfig,
      //              assetConfig, controlVocabConfig, loadingExampleConfig,
      //              filterConfig }
      // dispatch first
      const { configs } = action.payload;
      state.configs = configs;
    },
    modelReceived(state, action) {
      // this is basically an init script
      // dispatch after configsLoaded
      const { model } = action.payload;
      state.model = model;
      // initialize allTaggedNodes
      state.fullTagMatrix = calcNodeTagMatrix(state.model,
                                              state.configs.filterConfig.facetFilters,
                                              []);
      state.displayedTagMatrix = _.cloneDeep(state.fullTagMatrix);
      
      let taggedNodes = new Set();
      Object.keys(state.fullTagMatrix)
        .forEach((key) => {
          Object.keys(state.fullTagMatrix[key])
            .forEach( (val) => {
              state.fullTagMatrix[key][val]
                .nodes.forEach( (hndl) => { taggedNodes.add(hndl); } );
            });
        });
      state.allTaggedNodes = [];
      taggedNodes.forEach( (hndl) => { state.allTaggedNodes.push(hndl); } );
      
    },
    hiddenNodesUpdated(state, action) {
      // hiddenNodes: an Array of node handles (strings)
      const { hiddenNodes } = action.payload;
      // replacement
      state.hiddenNodes = hiddenNodes;
      state.displayedTagMatrix = calcNodeTagMatrix(state.model,
                                                   state.configs.filterConfig.facetFilters,
                                                   hiddenNodes);
    },
    filterSelectorToggled(state, action) {
      // checkBoxInfo - filterConfig element plus isChecked
      // dispatch after modelReceived
      const {tag, value} = action.payload;
      if (tag !== undefined || value !== undefined) {
        // update checkboxes
        state.checkboxState[`checkbox_${tag}_${value}`] =
          !state.checkboxState[`checkbox_${tag}_${value}`];
        const filter = {tag, value};
        let fs = [];
        // update filtersSelected
        fs = _.cloneDeep(state.filtersSelected);
        if (state.checkboxState[`checkbox_${tag}_${value}`]) {
          fs.push(filter);
        }
        else {
          fs = fs.filter( (item) => !(item.tag == tag && item.value == value) );
        }
        state.filtersSelected = fs;
        // determine nodes to hide
        state.hiddenNodes = calcHiddenNodes(state.filtersSelected,
                                            state.fullTagMatrix,
                                            state.allTaggedNodes);
        
        // calculate counts
        if (state.hiddenNodes.length === 0) {
          state.displayedTagMatrix = _.cloneDeep(state.fullTagMatrix);
        } else {
          state.displayedTagMatrix = calcNodeTagMatrix(state.model,
                                                       state.configs.filterConfig.facetFilters,
                                                       state.hiddenNodes);
        }
      }
    },
    filterGroupCleared(state, action) {
      const {facetItem} = action.payload;
      // update checkboxes
      facetItem.checkboxItems.forEach( (item) => {
        state.checkboxState[`checkbox_${item.tag}_${item.value}`] = false;
      });
      // update filtersSelected
      const fs = _.cloneDeep(state.filtersSelected);
      state.filtersSelected = fs.filter( (item) =>
        item.tag !== _.toLower(facetItem.tag) );
      // determine nodes to hide
      state.hiddenNodes = calcHiddenNodes(state.filtersSelected,
                                          state.fullTagMatrix,
                                          state.allTaggedNodes);
      
      // calculate counts
      if (state.hiddenNodes.length === 0) {
        state.displayedTagMatrix = _.cloneDeep(state.fullTagMatrix);
      } else {
        state.displayedTagMatrix = calcNodeTagMatrix(state.model,
                                                     state.configs.filterConfig.facetFilters,
                                                     state.hiddenNodes);
      }
    },
    allFiltersCleared(state, action) {
      // reset all checkboxes
      Object.keys(state.checkboxState).forEach( (key) => {
          state.checkboxState[key] = false; });
      // reset filtersSelected
      state.filtersSelected = [];
      // clear hidden nodes
      state.hiddenNodes = []
      // reset displayed counts to totals
      state.displayedTagMatrix = _.cloneDeep(state.fullTagMatrix);
    },

  }
});

function calcHiddenNodes(filtersSelected, fullTagMatrix, allTaggedNodes) {
  if (filtersSelected.size === 0) {
    return [];
  }
  let showNodes = [];
  let nodes = {};
  let universe = new Set();
  let arrUniverse = [];
  filtersSelected.forEach( ({tag, value}) => {
    if (!nodes[tag]) {
      nodes[tag] = new Set();
    }
    // OR/union within group (= tag key)
    fullTagMatrix[tag][value].nodes
      .forEach( (hndl) => {
        nodes[tag].add(hndl);
        universe.add(hndl);
      } );
  });
  // AND/intersection between groups
  universe.forEach( (hndl) => { arrUniverse.push(hndl); } );
  showNodes = arrUniverse.filter(
    // node should be shown if its handle appears in every group set
    // (i.e., if it is in the intersection of all the group sets)
    (hndl) => Object.values(nodes).every( (set) => set.has(hndl) )
  );
  // return allTaggedNodes - showNodes = hiddenNodes
  return allTaggedNodes.filter( (hndl) => !showNodes.includes(hndl) );
}

function calcNodeTagMatrix(model, facetFilters, hiddenNodes) {
  let nc = {};
  const facetTypes = facetFilters.map( facetFilter => facetFilter.type );
  facetTypes.filter( type => type.entity === 'node')
    .forEach( (type) => {
      model.tag_kvs(type.tag)
        .forEach(
          ([key, val]) => {
            const taggedNodes = model.tagged_items(key, val)
                  .filter( (ent) => (ent._kind == 'Node')
                           && !hiddenNodes.includes(ent.handle));
            if (!nc[key]) {
              nc[key] = {};
            }
            let info = {nodes: [], count: 0};
            if (taggedNodes) {
              info.nodes = taggedNodes.map( n => n.handle );
              info.count = taggedNodes.length;
            }
            nc[key][val] = info;
          });
    });
  facetTypes.filter( type => type.entity === 'prop')
    .forEach( (type) => {
      model.tag_kvs(type.tag)
        .forEach( ([key, val]) => {
          const taggedProps = model.tagged_items(key, val)
                .filter( (ent) => ent._kind == 'Property' );
          let info = { nodes: [], count:0 };
          if (taggedProps) {
            let propsCount = 0;
            let nodeSet = new Set();
            taggedProps
              .forEach( (prop) => {
                if (prop.owner._kind == 'Node'
                    && !hiddenNodes.includes(prop.owner.handle)) {
                  propsCount += 1;
                  nodeSet.add(prop.owner.handle);
                }
              });
            info.count = propsCount;
            nodeSet.forEach( n => {
              info.nodes.push(n);
            });
          }
          if (!nc[key]) {
            nc[key] = {};
          }
          nc[key][val] = info;
        });
    });
  return nc;
}

export const {
  modelReceived,
  configsLoaded,
  hiddenNodesUpdated,
  filterSelectorToggled,
  filterGroupCleared,
  allFiltersCleared
} = filterSlice.actions;
// use as dispatch(modelReceived({model}), dispatch(configsLoaded({configs})

export default filterSlice.reducer;

export const selectModel = state => state.filter.model;
export const selectConfigs = state => state.filter.configs;
export const selectFilterConfig = state => state.filter.configs.filterConfig;
export const selectFacetFilters = state => state.filter.configs.filterConfig.facetFilters;
export const selectDisplayedTagMatrix = state => state.filter.displayedTagMatrix;
export const selectFullTagMatrix = state => state.filter.fullTagMatrix;
export const selectCheckboxState = state => state.filter.checkboxState;
export const selectFiltersSelected = state => state.filter.filtersSelected;
export const selectFacetSectionProps = state => state.filter.configs.filterConfig.facetSectionProps;
