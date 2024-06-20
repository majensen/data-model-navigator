import { createSlice, createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import {
  selectIsSearchMode,
  selectSearchResult,
} from '../search/searchSlice';

import _ from 'lodash';

const initialState = {
  isGraphView: true,
  layoutInitialized: false,
  nodes: [],
  edges: [],
  graphViewConfig: {},
  graphBoundingBox: [],
  legendDisplayed: false,
  nodeDisplayed: false,
  legendItems: [],
  categories: [],
  hoveringNode: null,
  focusedNodeID: null,
  highlightingNodeID: null,
  highlightedNodeIDs: [],
  relatedNodeIDs: [],
  secondHighlightingNodeID: null,
  dataModelStructure: null,
  canvasBoundingRect: { top: 0, left: 0 },
  needReset: false,
  expandNodeView: false,
  tableExpandNodeIDs: [],
  overlayPropertyHidden: true,
  graphNodesSVGElements: null,
  matchedNodeIDs: [],
  matchedNodeIDsInProperties: [],
  matchedNodeIDsInNameAndDescription: [],
  highlightingMatchedNodeID: null,
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
      // state.model = () => model;
      // state.graphConfig = graphConfig;
      state.graphViewConfig = graphViewConfig; //??
      state.categories =  _.uniq(model.tag_kvs('Category').map(([,val]) => val));
    },
    reactFlowGraphDataCalculated(state, action) {
      const { flowData } = action.payload;
      state.nodes = flowData.nodes;
      state.edges = flowData.edges;
    },
    // graph click blank space
    tableNodeExpanded(state, action) {
      const { nodeState, nodeID } = action.payload;
      state.highlightingNode = nodeID;
      state.secondHighlightingNodeID = null;
      switch (nodeState) {
      case 'open':
        if (state.tableExpandNodeIDs) {
          state.tableExpandNodeIDs.push(nodeID);
        } else {
          state.tableExpandNodeIDs = [nodeID];
        }
        break;
      case 'close':
        state.tableExpandNodeIDs = _.remove(state.tableExpandNodeIDs, elt => elt.id === nodeID);
        break;
      default:
        break;
      }
    },
    // expand tables nodeS

    // graph nodes svg elements updated

    reactFlowPanelClicked(state, action) {
      state.expandNodeView = false;
    },
    reactFlowNodeDragStarted(state, action) {
      state.expandNodeView = false;
    },
    reactFlowNodeExpanded(state, action) {
      state.expandNodeView = true;
    },
    reactFlowNodeDisplayChanged(state, action) {
      const display = action.payload;
      state.nodeDisplayed = display;
    },
    reactFlowGraphViewChanged(state, action) { // determine param, onViewChange
      const view  = action.payload;
      localStorage.setItem('reactflowGraphView', JSON.stringify(view));
      state.reactFlowView = view;
    },
    reactFlowNodeFocused(state, action) {
      const nodeID  = action.payload;
      state.focusedNodeId = nodeID;
    },
    reactFlowNodeClicked(state, action) {
      const {id, isSearchMode, model} = action.payload;
      if (state.highlightedNodes.includes(id)) {
        state.highlightedNodes = _.filter(state.highlightedNodes, elt => elt.id === id);
      } else {
        state.highlightedNodes.push(id);
      }
      state.highlightingMatchedNodeID = id;
      state.highlightingNode = model.nodes(id);
      state.highlightingMatchedNodeOpened = false;
      state.overlayPropertyHidden = isSearchMode ? false : true;
      state.expandNodeView = isSearchMode ? false : true;
    },
    legendDisplayChanged(state, action) {
      const display = action.payload;
      state.legendDisplayed = display;
    },
    canvasWidthChanged(state, action) {
      const width  = action.payload;
      state.graphViewConfig.canvasWidth = width;
    },
    graphTableViewToggled(state, action) {
      const isGraphView = action.payload;
      state.isGraphView = !isGraphView; // toggle HERE
      state.overlayPropertyHidden = true; // ? should toggle?
    },
    graphLegendCalculated(state, action) {
      const legendItems = action.payload;
      state.legendItems = legendItems;
    },
    hoveringNodeUpdated(state, action) {
      const nodeID = action.payload;
      const newHoverNode = state.nodes.find( n => n.id === nodeID );
      state.hoveringNode = newHoverNode;
    },
    canvasBoundingRectUpdated(state, action) {
      const boundingRect = action.payload;
      state.canvasBoundingRect = boundingRect;
    },
    // graph update related highlighting node
    graphRelatedHighlightingNodesUpdated(state, action) {
      const nodeIDs = action.payload;
      state.relatedNodeIDs = nodeIDs;
    },
    // graph update second highlighting node candidates
    // graph update path related to second highlighting node
    // graph update data model structure
    changedVisOverlayPropTable(state, action) {
      const isHidden = action.payload;
      state.overlayPropertyHidden = isHidden;
    },
    canvasResetRequested(state, action) {
      const needReset = action.payload;
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
  reactFlowNodeClicked,
  reactFlowNodeExpanded,
  reactFlowNodeFocused,
  reactFlowNodeDisplayChanged,
  reactFlowGraphViewChanged,
  graphLegendCalculated,
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

export const selectLegendDisplayed = state => state.graph.legendDisplayed;
export const selectGraphViewConfig = state => state.graph.graphViewConfig;
export const selectCategories = state => state.graph.categories;
export const selectCanvasWidth = state => state.graph.graphViewConfig.canvasWidth;
export const selectHighlightingMatchedNodeID = state => state.graph.highlightingMatchedNodeID;
export const selectHighlightingNodeID = state => state.graph.highlightingNodeID;
export const selectFocusedNodeID = state => state.graph.focusedNodeID;
export const selectNodeDisplayed = state => state.graph.nodeDisplayed;
export const selectPropTableNodeID = createSelector(
  [selectIsSearchMode, selectHighlightingMatchedNodeID, selectHighlightingNodeID],
  (isSearchMode, matchedNodeID, highlightingNodeID) => {
    if (isSearchMode) {
      if (matchedNodeID) {
        return matchedNodeID; 
      } 
      if (highlightingNodeID) {
        return highlightingNodeID; // if this is a model node - if it is a graph node,
        // find model node by the graph node and return
      }
      else { return null; }
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
