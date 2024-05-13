/* eslint no-unused-vars: 0 */
/* eslint-disable react-hooks/rules-of-hooks */

import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import CircularProgress from '@material-ui/core/CircularProgress';
import _ from 'lodash';
import CanvasView from './CanvasView';
import { createNodesAndEdges } from '../GraphUtils/MDFutils';
import { getDistinctCategoryItems, setMatchingNodeTitle, getCategoryIconUrl } from './util';
import {
  onNodeDragStart, onPanelViewClick, onViewChange, setReactFlowGraphData,
} from '../../Store/actions/graph';
import { getNodePosition } from './CanvasHelper';
import defaultIcon from './assets/graph_icon/study.svg';

/**
 * Handles all canvas state
 * 1. nodes
 * 2. edges
 * 3. positioning of nodes with BFS
 * 4. tracks search mode
 * @param {*} param0
 * @returns canvas component
 */

const CanvasController = ({
//   flowData,
  ddgraph,
  currentSearchKeyword,
  tabViewWidth,
  model,
  searchResults,
  isSearchMode,
  onClearSearchResult,
  setGraphData,
  nodeTree,
  unfilteredDictionary,
  highlightedNodes,
  graphViewConfig,
  onGraphPanelClick,
  assetConfig,
}) => {
  if (tabViewWidth === 0 || !graphViewConfig) {
    return <CircularProgress />;
  }

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [categories, setCategories] = useState([]);
  const [iconsURL, setIconsURL] = useState({});

  /**
     * initalize category item for Legend
     */
  useEffect(() => {
    const cats = getDistinctCategoryItems(Object.values(unfilteredDictionary));
    setCategories(cats);
    const urls = getCategoryIconUrl(cats, `${assetConfig?.iconUrl}`);
    setIconsURL(urls);
  }, []);

  /** node
    * 1. position (x, y)
    * 2. title
    * 3. highlight node based on matching search query to desc, properties and title
    */
  const getLayoutedElements = (nodes_, edges_, nodeInternals, direction = 'TB') => {
    /**
         * highlight node based on matching search query to desc, properties and title
         * setMatchingNodeTitle return indexes to highlight node title (string)
         */
    var nodes = _.cloneDeep(nodes_);
    var edges = _.cloneDeep(edges_);
    if (isSearchMode) {
      const matchingNodeTitle = setMatchingNodeTitle(searchResults);
      nodes.forEach((node) => {
        if (matchingNodeTitle[node.id]) {
          node.data.matchedNodeNameQuery = currentSearchKeyword; // eslint-disable-line
        }
      });
    }
    /**
         * assign node position
         * canvas configuration
         * 1. custom node tree
         * 2. xInterval & yInterval
         */
    const { canvas } = graphViewConfig;
    if (model && nodeTree) {
      const nodePosition = getNodePosition({
        model,
        nodeTree: canvas?.nodeTree || nodeTree,
        tabViewWidth,
        ...canvas?.fit,
      });
      nodes.forEach((node) => {
        if (!node.data.icon) {
          node.data.icon = defaultIcon; // eslint-disable-line
        }
        const position = nodePosition[node.id];
        node.position = { // eslint-disable-line
          x: position[0],
          y: position[1],
        };
      });
    }
    return { nodes, edges };
  };

  /**
     * update states
     * 1. nodes and edges
     * 2. toggle between on/off for search mode
     */
  useEffect(() => {
    const flowData = createNodesAndEdges({ model }, true, []);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      flowData.nodes,
      flowData.edges,
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [model, currentSearchKeyword]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(
      { ...params, type: 'smoothstep', animated: true }, eds,
    )),
    [],
  );

  if (nodes.length === 0 && edges.length === 0) {
    return <CircularProgress />;
  }

  return (
    <CanvasView
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      categories={categories}
      onClearSearchResult={onClearSearchResult}
      highlightedNodes={highlightedNodes}
      graphViewConfig={graphViewConfig}
      canvasWidth={tabViewWidth}
      onGraphPanelClick={onGraphPanelClick}
    />
  );
};

const mapStateToProps = (state) => ({
  ddgraph: state.ddgraph,
  isSearchMode: state.ddgraph.isSearchMode,
  currentSearchKeyword: state.ddgraph.currentSearchKeyword,
  searchResults: state.ddgraph.searchResult,
  nodeTree: state.submission.node2Level,
  highlightedNodes: state.ddgraph.highlightedNodes,
  unfilteredDictionary: state.submission.unfilteredDictionary,
  graphViewConfig: state.ddgraph.graphViewConfig,
  assetConfig: state.ddgraph.assetConfig,
});

const mapDispatchToProps = (dispatch) => ({
  setGraphData: (graphData) => { dispatch(setReactFlowGraphData(graphData)); },
  onGraphPanelClick: () => { dispatch(onPanelViewClick()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(CanvasController);
