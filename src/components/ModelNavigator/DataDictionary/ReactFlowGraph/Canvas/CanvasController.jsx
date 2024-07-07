/* eslint no-unused-vars: 0 */
/* eslint-disable react-hooks/rules-of-hooks */

import React, { useCallback, useEffect, useState, useContext } from 'react';
import { forceCollide, forceCenter, forceSimulation, forceLink, forceManyBody, forceX, forceY } from 'd3-force';
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
import { ModelContext } from '../../../Model/ModelContext';
import { ConfigContext } from '../../../Config/ConfigContext';
import CanvasView from './CanvasView';
import { defaultStyleAttributes } from '../../../Config/nav.config'
import { createNodesAndEdges } from '../GraphUtils/MDFutils';
import {  setMatchingNodeTitle } from './util';
import {
  reactFlowGraphInitialized,
  reactFlowNodeDragStarted, reactFlowPanelClicked, reactFlowGraphViewChanged,
  reactFlowGraphDataCalculated,
  updateGraphBox,
  selectGraphViewConfig,
  selectAssetConfig
} from '../../../../../features/graph/graphSlice';
import {
  selectIsSearchMode,
  selectCurrentSearchKeyword,
  selectSearchResult,
} from '../../../../../features/search/searchSlice';
import {
  selectHiddenNodes,
} from '../../../../../features/filter/filterSlice';

const defaultIcon = defaultStyleAttributes.graph.icon;

const simulation = forceSimulation()
      .force('charge', forceManyBody().strength(-1000))
//      .force('x', forceX().x(0).strength(0.05))
//      .force('y', forceY().y(0).strength(0.05))
//      .force('collide', collide())
      .force('center', forceCenter())
      .alphaTarget(0.05)
      .stop();

const numTicks = 3; // number of simulation ticks to get initial layout - put in config later

const createNodeCoordinatesSetter = (nodes, edges) => {
    // must clone edges, since simulation replaces source and target with
    // actual node objects, and we need the simple handles for rendering
  // in flowgraph
  let sim_nodes = _.cloneDeep(nodes);
  let sim_edges = _.cloneDeep(edges);
  simulation.nodes(sim_nodes).
    force(
      'link',
      forceLink(sim_edges)
        .id((d) => d.id)
        .strength(0.01)
        .distance(50)
    );
  simulation.tick(numTicks);
  const positionByID = _.zipObject(
    sim_nodes.map( node => node.id ),
    sim_nodes.map(
      (node) => ({ x:node.x, y:node.y })
    ));
  // closure preserves original initted coordinates
  return (nodes, edges) => {
    nodes.forEach( (node) => {
      node.position.x = positionByID[node.id].x;
      node.position.y = positionByID[node.id].y;
    });
  };
};

let nodeCoordinatesSetter = null;

const getLayoutedElements = (
  nodes, edges, isSearchMode, defaultIcon,
  searchResult, currentSearchKeyword, hiddenNodes,
  coordinatesSetter) => {
    const nodes_r = _.cloneDeep( nodes.filter( n => !hiddenNodes.includes(n.id) ) );
    const edges_r = _.cloneDeep( edges.filter( ed => !(hiddenNodes.includes(ed.source) ||
                                                       hiddenNodes.includes(ed.target)) ) );
    nodes_r.forEach(
      (node) => {
        if (!node.data.icon) {
          node.data.icon = defaultIcon;
        }
      });
    if (isSearchMode) {
      const matchingNodeTitle = setMatchingNodeTitle(searchResult);
      if (matchingNodeTitle) {
        nodes_r.forEach(
          (node) => {
            if(matchingNodeTitle[node.id]) {
              node.data.matchedNodeNameQuery = currentSearchKeyword;
            }
          });
      }
    }
    coordinatesSetter(nodes_r, edges_r);
    return {nodes_r, edges_r};
  };


const CanvasController = ({
  graphViewConfig,
  tabViewWidth,
  onClearSearchResult,
  highlightedNodes,
}) => {
  const model = useContext( ModelContext );
  const config = useContext( ConfigContext );
  if (tabViewWidth === 0 || !model) { // eslint-disable-line no-undef
    return <CircularProgress />;
  }
  const dispatch = useDispatch();
  dispatch(reactFlowGraphInitialized({graphViewConfig, model}));
  const isSearchMode = useSelector( selectIsSearchMode );
  const searchResult = useSelector( selectSearchResult );
  const currentSearchKeyword = useSelector( selectCurrentSearchKeyword );
  const hiddenNodes = useSelector( selectHiddenNodes );
  
  // leave in React std form for flowGraph
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const flowData = createNodesAndEdges(model, config);
  if (!nodeCoordinatesSetter) {
    nodeCoordinatesSetter = createNodeCoordinatesSetter(flowData.nodes, flowData.edges);
  }

  useEffect(() => {
    const {nodes_r: layoutNodes, edges_r: layoutEdges} = getLayoutedElements(
      flowData.nodes, flowData.edges,
      isSearchMode,
      defaultIcon,
      searchResult,
      currentSearchKeyword,
      hiddenNodes,
      nodeCoordinatesSetter, 
    );
    dispatch(reactFlowGraphDataCalculated({flowData}));
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [isSearchMode, searchResult, currentSearchKeyword, hiddenNodes]); // deps ensure updates on filter changes


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
    />
  );
};

export default CanvasController;
