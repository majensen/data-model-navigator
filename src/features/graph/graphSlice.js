import { createSlice, createSelector } from '@reduxjs/toolkit';
import {
  selectIsSearchMode,
  selectSearchResult,
} from '../search/searchSlice';

import _ from 'lodash';

const initialState = {
  model: {},
  isGraphView: true,
  layoutInitialized: false,
  nodes: [],
  edges: [],
  graphViewConfig: {},
  graphBoundingBox: [],
  legendDisplayed: false,
  legendItems: [],
  categories: [],
  hoveringNode: null,
  highlightingNode: null,
  relatedNodeIDs: [],
  secondHighlightingNodeID: null,
  dataModelStructure: null,
  canvasBoundingRect: { top: 0, left: 0 },
  needReset: false,
  tableExpandNodeID: null,
  graphNodesSVGElements: null,
  matchedNodeIDs: [],
  matchedNodeIDsInProperties: [],
  matchedNodeIDsInNameAndDescription: [],
  highlightingMatchedNodeID: "",
  highlightingMatchedNodeOpened: false,
};

// how to give search its own slice and interact here?
// "versionInfo" - where to put - it's part of the model

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    reactFlowGraphInitialized(state, action) {
      const { model, graphViewConfig } = action.payload;
      state.model = model;
      // state.graphConfig = graphConfig;
      state.graphViewConfig = graphViewConfig; //??
      state.categories =  _.uniq(model.tag_kvs('Category').map(([,val]) => val));
    },
    reactFlowGraphDataCalculated(state, action) {
      const { flowData } = action.payload;
      state.nodes = flowData.nodes;
      state.edges = flowData.edges;
    },
    // graph click node, graph react flowgraph click node
    // graph click blank space
    tableNodeExpanded(state, action) {
    },
    // expand tables nodeS

    // graph nodes svg elements updated

    reactFlowPanelClicked(state, action) {
      state.expandNodeView = false;
    },
    reactFlowNodeDragStarted(state, action) {
      state.expandNodeView = false;
    },
    reactFlowGraphViewChanged(state, action) { // determine param, onViewChange
      const view  = action.payload;
      localStorage.setItem('reactflowGraphView', JSON.stringify(view));
      state.reactFlowView = view;
    },
    reactFlowNodeFocused(state, action) {
      const { nodeID } = action.payload;
      state.focusedNodeId = nodeID;
    },
    legendDisplayChanged(state, action) {
      const { display } = action.payload;
      state.legendDisplayed = display;
    },
    canvasWidthChanged(state, action) { // determine param, onCanvasWidthChange
      const { width } = action.payload;
      state.graphViewConfig.canvasWidth = width;
    },
    graphTableViewToggled(state, action) {
      const { isGraphView } = action.payload;
      state.isGraphView = !isGraphView; // toggle HERE
      state.overlayPropertyHidden = true; // ? should toggle?
    },
    // graph legend calculated
    hoveringNodeUpdated(state, action) {
      const { nodeID } = action.payload;
      const newHoverNode = state.nodes.find( n => n.id === nodeID );
      state.hoveringNode = newHoverNode;
    },
    canvasBoundingRectUpdated(state, action) {
      const { boundingRect } = action.payload;
      state.canvasBoundingRect = boundingRect;
    },
    // graph update related highlighting node
    // graph update second highlighting node candidates
    // graph update path related to second highlighting node
    // graph update data model structure
    changedVisOverlayPropTable(state, action) {
      const { isHidden } = action.payload;
      state.overlayPropertyHidden = isHidden;
    },
    canvasResetRequested(state, action) {
      const { needReset } = action.payload;
      state.needReset = needReset;
    },
    // graph reset highlight
  },
});


export const {
  // reducer/actions
  reactFlowGraphInitialized,
  tableNodeExpanded,
  reactFlowGraphDataCalculated,
  reactFlowPanelClicked,
  reactFlowNodeDragStarted,
  reactFlowGraphViewChanged,
  legendDisplayChanged,
  canvasWidthChanged,
  graphTableViewToggled,
  hoveringNodeUpdated,
  canvasBoundingRectUpdated,
  changedVisOverlayPropTable,
  canvasRestRequested,
} = graphSlice.actions;

export default graphSlice.reducer;

// export Selectors

export const selectModel = state => state.graph.model;
export const selectLegendDisplayed = state => state.graph.legendDisplayed
export const selectGraphViewConfig = state => state.graph.graphViewConfig;
export const selectCategories = state => state.graph.categories;
export const selectCanvasWidth = state => state.graph.graphViewConfig.canvasWidth;
export const selectHighlightingMatchedNodeID = state => state.highlightingMatchedNodeID;
export const selectHighlightingNode = state => state.highlightingNode;
export const selectPropTableNode = createSelector(
  [selectIsSearchMode, selectHighlightingMatchedNodeID, selectHighlightingNode, selectModel],
  (isSearchMode, matchedNodeID, highlightingNode, model) => {
    if (isSearchMode) {
      if (matchedNodeID) {
        return model.nodes( matchedNodeID ); // prob not correct - what is used as ID?
      } 
      if (highlightingNode) {
        return highlightingNode; // if this is a model node - if it is a graph node,
        // find model node by the graph node and return
      } else { return null; }
    } else { return null; }
  });
export const selectSearchResultOfHighlighted = createSelector(
  [selectIsSearchMode, selectSearchResult, selectHighlightingMatchedNodeID],
  (isSearchMode, searchResult, matchedNodeID) => {
    if (isSearchMode) {
      return searchResult
        .find( item => item.id == matchedNodeID );
    }
    return null;
  });
