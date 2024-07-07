import { createSlice, createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import _ from 'lodash';

const initialState = {
  isGraphView: true,
  layoutInitialized: false,
  nodes: [],
  edges: [],
  graphViewConfig: {},
  graphBoundingBox: [],
  legendDisplayed: true,
  expandedNodeID: null,
  foregroundedNodes: [],
  legendItems: [],
  categories: [],
  hoveringNode: null,
  focusedNodeID: null,
  highlightingNodeID: null,
  relatedNodeIDs: [],
  secondHighlightingNodeID: null,
  dataModelStructure: null,
  canvasBoundingRect: { top: 0, left: 0 },
  needReset: false,
  tableExpandNodeIDs: [],
  overlayTableHidden: true,
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
      const { graphViewConfig, model } = action.payload;
      state.graphViewConfig = graphViewConfig; //??
      state.categories =  _.uniq(model.tag_kvs('Category').map(([,val]) => val)); 
    },
    reactFlowGraphDataCalculated(state, action) {
      const { flowData } = action.payload;
      state.nodes = flowData.nodes;
      state.edges = flowData.edges;
    },
    clickedBlankSpace(state, action) { // this is weird.
      if (state.highlightingNode) {
        if (state.secondHighlightingNodeID) {
          state.secondHighlightingNodeID = null;
        }
        else {
          state.highlightingNode = null;
          state.tableExpandNodeID = null;
        }
      }
    },
    tableNodeExpandChanged(state, action) {
      const { nodeState, nodeID } = action.payload;
      state.highlightingNode = nodeID;
      state.secondHighlightingNodeID = null;
      switch (nodeState) {
      case 'open':
        if (state.tableExpandNodeIDs) {
          !state.tableExpandNodeIDs.includes(nodeID) && state.tableExpandNodeIDs.push(nodeID);
        } else {
          state.tableExpandNodeIDs = [nodeID];
        }
        break;
      case 'close':
        state.tableExpandNodeIDs = _.filter(state.tableExpandNodeIDs, elt => elt !== nodeID);
        break;
      default:
        break;
      }
    },
    // expand tables nodeS

    // graph nodes svg elements updated

    reactFlowPanelClicked(state, action) {

    },
    reactFlowNodeDragStarted(state, action) {

    },
    // reactFlowNodeExpanded(state, action) {

    // },
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
      const {id: nodeID, isSearchMode} = action.payload;
      if (state.expandedNodeID == nodeID) {
        state.expandedNodeID = null;
      } else {
        state.expandedNodeID = nodeID;
      }
      state.highlightingMatchedNodeID = nodeID;
      state.highlightingNodeID = nodeID;
      state.highlightingMatchedNodeOpened = false;
      state.overlayTableHidden = isSearchMode ? false : true;
    },
    changedVisOverlayPropTable(state, action) {
      const vis = action.payload;
      state.overlayTableHidden = vis == 'hide' ? true : false;
    },
    tabGraphViewChanged(state, action) {
      const showGraphView = action.payload;
      state.isGraphView = showGraphView;
    },
    legendDisplayChanged(state, action) {
      const display = action.payload;
      state.legendDisplayed = display;
    },
    canvasWidthChanged(state, action) {
      const width  = action.payload;
      state.graphViewConfig.canvasWidth = width;
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
  tableNodeExpandChanged,
  reactFlowGraphDataCalculated,
  reactFlowPanelClicked,
  reactFlowNodeDragStarted,
  reactFlowNodeClicked,
  reactFlowNodeExpanded,
  reactFlowNodeFocused,
  reactFlowNodeDisplayChanged,
  reactFlowGraphViewChanged,
  clickedBlankSpace,
  graphLegendCalculated,
  tabGraphViewChanged,
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

export const selectIsGraphView = state => state.graph.isGraphView;
export const selectLegendDisplayed = state => state.graph.legendDisplayed;
export const selectGraphViewConfig = state => state.graph.graphViewConfig;
export const selectCategories = state => state.graph.categories;
export const selectCanvasWidth = state => state.graph.graphViewConfig.canvasWidth;
export const selectHighlightingMatchedNodeID = state => state.graph.highlightingMatchedNodeID;
export const selectHighlightingNodeID = state => state.graph.highlightingNodeID;
export const selectHighlightedNodes = state => state.graph.selectHighlightedNodes;
export const selectExpandedNodeID = state => state.graph.expandedNodeID;
export const selectFocusedNodeID = state => state.graph.focusedNodeID;
// export const selectNodeDisplayed = state => state.graph.nodeDisplayed;
export const selectOverlayTableHidden = state => state.graph.overlayTableHidden;
export const selectNodeIsExpanded = (state, nodeID) => state.graph.expandedNodeID == nodeID;
export const selectNodeIsForegrounded = (state, nodeID) => state.graph.foregroundedNodes.includes(nodeID);

export const selectTableNodeIsExpanded = (state, nodeID) => state.graph.tableExpandNodeIDs && state.graph.tableExpandNodeIDs.includes(nodeID); 

export const selectPropTableNodeID = createSelector(
  [selectHighlightingMatchedNodeID, selectHighlightingNodeID],
  (matchedNodeID, highlightingNodeID) => {
    return matchedNodeID || highlightingNodeID || null;
  });

