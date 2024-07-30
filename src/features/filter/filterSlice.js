/* eslint-disable no-undef */
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

import {
  filterConfig,
  controlVocabConfig,
} from "../../components/ModelNavigator/Config/nav.config";


const initialState = {
  configs: {filterConfig, controlVocabConfig},
  hiddenNodes: [],
  haveFilters: false,
  allTaggedNodes: [],
  fullTagMatrix: null,
  displayedTagMatrix: {},
  checkboxState: null,
  filtersSelected: [],
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    filtersInitRequested(state, action) {
      const model  = action.payload;
      globalThis.model = model;
      const tags = globalThis.config.facetFilters.map( (filt) => filt.tag );
      if (tags) {
        // does the model have any of these tags?
        let tagset = tags.flatMap( (tag) => model.tag_kvs(tag) );
        if (tagset && tagset.length > 0) {
          state.haveFilters = true;
          if (!state.fullTagMatrix) {
            // initialize allTaggedNodes
            state.fullTagMatrix = calcNodeTagMatrix(model,
                                                    globalThis.config.facetFilters,
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
          }
          if (!state.checkboxState) {
            let acc = {};
            globalThis.config.facetFilters.flatMap( // eslint-disable-line no-undef
              (filt) => {
                filt.checkboxItems.map((item) => {
                  acc[`checkbox_${item.tag}_${item.value}`] = false;
                });
              });
            state.checkboxState = acc;
          }
        }
        else {
          state.haveFilters = false;
        }
      }
      else {
        state.haveFilters = false;
      }
    },
    hiddenNodesUpdated(state, action) {
      // hiddenNodes: an Array of node handles (strings)
      const { model, hiddenNodes } = action.payload;
      // replacement
      state.hiddenNodes = hiddenNodes;
      state.displayedTagMatrix = calcNodeTagMatrix(model, 
                                                   globalThis.config.facetFilters,
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
          fs = fs.filter( (item) => !(item.tag === tag && item.value === value) );
        }
        // determine nodes to hide
        state.hiddenNodes = calcHiddenNodes(fs,
                                            state.fullTagMatrix,
                                            state.allTaggedNodes);
        state.filtersSelected = fs;
        
        // calculate counts
        if (state.hiddenNodes.length === 0) {
          state.displayedTagMatrix = _.cloneDeep(state.fullTagMatrix);
        } else {
          state.displayedTagMatrix = calcNodeTagMatrix(globalThis.model, 
                                                       globalThis.config.facetFilters,
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
        state.displayedTagMatrix = calcNodeTagMatrix(globalThis.model, 
                                                     globalThis.config.facetFilters,
                                                     state.hiddenNodes);
      }
    },
    allFiltersCleared(state, action) {
      // reset all checkboxes
      if (state.checkboxState) {
        Object.keys(state.checkboxState).forEach( (key) => {
          state.checkboxState[key] = false; });
      }
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
  if (filtersSelected.length === 0) {
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
                  .filter( (ent) => (ent._kind === 'Node')
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
                .filter( (ent) => ent._kind === 'Property' );
          let info = { nodes: [], count:0 };
          if (taggedProps) {
            let propsCount = 0;
            let nodeSet = new Set();
            taggedProps
              .forEach( (prop) => {
                // if prop.owner is null => the Property is defined but doesn't
                // appear under any Node in MDF.
                if (prop.owner && prop.owner._kind === 'Node'
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
  filtersInitRequested,
  hiddenNodesUpdated,
  filterSelectorToggled,
  filterGroupCleared,
  allFiltersCleared
} = filterSlice.actions;

export default filterSlice.reducer;

export const selectHaveFilters = state => state.filter.haveFilters;
export const selectHiddenNodes = state => state.filter.hiddenNodes;
export const selectDisplayedTagMatrix = state => state.filter.displayedTagMatrix;
export const selectFullTagMatrix = state => state.filter.fullTagMatrix;
export const selectCheckboxState = state => state.filter.checkboxState;
export const selectFiltersSelected = state => state.filter.filtersSelected;
