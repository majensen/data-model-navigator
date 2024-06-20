/* eslint no-unused-vars: 0 */
/* eslint-disable react-hooks/rules-of-hooks */

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { forceSimulation, forceLink, forceManyBody, forceX, forceY } from 'd3-force';
import { useSelector, useDispatch } from 'react-redux';
import {
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  useStore,
} from 'reactflow';
import CircularProgress from '@material-ui/core/CircularProgress';
import _ from 'lodash';
import { collide } from './collide.js';
import CanvasView from './CanvasView';
import { createNodesAndEdges } from '../GraphUtils/MDFutils';
import { getDistinctCategoryItems, setMatchingNodeTitle, getCategoryIconUrl } from './util';
import {
  reactFlowGraphInitialized,
  //  onNodeDragStart, onPanelViewClick, onViewChange, setReactFlowGraphData,
  reactFlowNodeDragStarted, reactFlowPanelClicked, reactFlowGraphViewChanged,
  reactFlowGraphDataCalculated,
  selectGraphViewConfig,
  selectAssetConfig
} from '../../../../../features/graph/graphSlice';
import {
  selectIsSearchMode,
  selectCurrentSearchKeyword,
  selectSearchResult,
} from '../../../../../features/search/searchSlice';
// import { getNodePosition } from './CanvasHelper';
import defaultIcon from './assets/graph_icon/study.svg';

const simulation = forceSimulation()
  .force('charge', forceManyBody().strength(-1000))
  .force('x', forceX().x(0).strength(0.05))
  .force('y', forceY().y(0).strength(0.05))
  .force('collide', collide())
  .alphaTarget(0.05)
  .stop();

const numTicks = 20; // number of simulation ticks to get initial layout - put in config later

const getLayoutedElements = (
  nodes, edges, isSearchMode, defaultIcon,
  searchResults, currentSearchKeyword) => {
    nodes.forEach(
      (node) => {
        if (!node.data.icon) {
          node.data.icon = defaultIcon;
        }
      });
    if (isSearchMode) {
      const matchingNodeTitle = setMatchingNodeTitle(searchResults);
      nodes.forEach(
        (node) => {
          if(matchingNodeTitle[node.id]) {
            node.data.matchedNodeNameQuery = currentSearchKeyword;
          }
        });
    }
    // must clone edges, since simulation replaces source and target with
    // actual node objects, and we need the simple handles for rendering
    // in flowgraph
    let sim_edges = _.cloneDeep(edges);
    simulation.nodes(nodes).force(
      'link',
      forceLink(sim_edges)
        .id((d) => d.id)
        .strength(0.1)
        .distance(100)
    );
    simulation.tick(numTicks);
    nodes.forEach(
      (node) => {
        node.position.x = node.x;
        node.position.y = node.y;
      });
    return {nodes, edges};
  };


const CanvasController = ({
  model,
  graphViewConfig,
  tabViewWidth,
  onClearSearchResult,
  highlightedNodes,
}) => {
  if (tabViewWidth === 0 || !model) {
    return <CircularProgress />;
  }
  const dispatch = useDispatch();

  dispatch(reactFlowGraphInitialized({model, graphViewConfig}));
  const isSearchMode = useSelector( selectIsSearchMode );
  const searchResults = useSelector( selectSearchResult );
  const currentSearchKeyword = useSelector( selectCurrentSearchKeyword );
  
  // leave in React std form for flowGraph
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // const [iconsURL, setIconsURL] = useState({});

  /**
     * initalize category item for Legend
     */
  // useEffect(() => {
  //   // const urls = getCategoryIconUrl(cats, `${assetConfig?.iconUrl}`);
  //   // setIconsURL(urls);
  // }, []);

  /** node
    * 1. position (x, y)
    * 2. title
    * 3. highlight node based on matching search query to desc, properties and title
    */
  /**
     * update states
     * 1. nodes and edges
     * 2. toggle between on/off for search mode
     */

  useEffect(() => {
    const flowData = createNodesAndEdges({model}, true, []);
    const {nodes: layoutNodes, edges: layoutEdges} = getLayoutedElements(
      flowData.nodes, flowData.edges, isSearchMode,
      defaultIcon, searchResults, currentSearchKeyword);
    dispatch(reactFlowGraphDataCalculated({flowData}));
    setNodes(layoutNodes);
    setEdges(layoutEdges);
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
      model={model}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onClearSearchResult={onClearSearchResult}
      highlightedNodes={highlightedNodes}
      graphViewConfig={graphViewConfig}
      canvasWidth={tabViewWidth}
      onGraphPanelClick={() => dispatch(reactFlowPanelClicked)}
    />
  );
};

export default CanvasController;
