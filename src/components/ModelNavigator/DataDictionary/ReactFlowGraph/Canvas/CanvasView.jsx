import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core';
import ReactFlow, {
  Background,
  ReactFlowProvider,
  useReactFlow,
  useViewport,
} from 'reactflow';
import NodeView from '../Node/NodeView';
import EdgeView from '../Edge/CustomEdgeView';
import Styles from './CanvasStyle';
import { getMinZoom } from './util';
import LegendView from '../Legend/LegendView';
import './Canvas.css';
import './assets/style.css';
import ActionLayer from './components/ActionLayer';
import resetIcon from './assets/graph_icon/Reset.svg';
import ZoomInIcon from './assets/graph_icon/ZoomIn.svg';
import ZoomOutIcon from './assets/graph_icon/ZoomOut.svg';
import OverlayPropertyTable from '../OverlayPropertyTable/OverlayPropertyTable';
import {
  reactFlowPanelClicked,
  selectCategories,
} from '../../../../../features/graph/graphSlice';
const nodeTypes = {
  custom: NodeView,
};

const edgeTypes = {
  custom: EdgeView,
};

/**
 *
 * @param {*} param0
 * @returns
 * reactflow requires to create child component
 *  to add customize control buttons
 */
const CustomFlowView = ({
  classes,
  model,
  nodes,
  edges,
  onConnect,
  onNodesChange,
  onEdgesChange,
  graphViewConfig,
  highlightedNodes,
}) => {

  const dispatch = useDispatch();
  const categories = useSelector( selectCategories );
  const { fitView } = useReactFlow();
  const { setViewport, zoomIn, zoomOut } = useReactFlow();

  const { fit, width } = graphViewConfig.canvas;

  const [minZoom, setMinZoom] = useState(fit?.minZoom);

  useViewport(); // I think this is called just to ensure re-render on viewport change.
  useEffect(() => {
    const zoom = getMinZoom({ width, ...fit });
    setMinZoom(zoom);
    fitView(width);
  }, [fit, width]);

  const handleTransform = useCallback(() => {
    setViewport({ x: fit?.x, y: fit?.y, zoom: getMinZoom({ width, ...fit }) }, { duration: 200 });
  }, [setViewport, width, fit]);

  /**
   * collapse all property dialog box
   * @param {*} event
   */
  const onPanelClick = (event) => { // eslint-disable-line
    dispatch(reactFlowPanelClicked());
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      minZoom={minZoom}
      maxZoom={fit?.maxZoom ? fit.maxZoom : 3}
      onPanelClick={onPanelClick}
      fitView
      className={classes.reactFlowView}
    >
      <OverlayPropertyTable
        model={model}
        matchedResult={""}
        hidden={true}
      />
      {/* <MiniMap nodeColor={nodeColor} style={minimapStyle} pannable position='bottom-left' /> */}
      {/* <Controls position='top-left' /> */}
      <div className={classes.controls}>
        <div onClick={handleTransform} title="reset" className={classes.controlBtn}>
          <img src={resetIcon} alt="reset_icon" />
        </div>
        <div title="zoom in" onClick={() => zoomIn({ duration: 200 })} className={classes.controlBtn}>
          <img src={ZoomInIcon} alt="ZoomInIcon" />
        </div>
        <div title="zoom out" onClick={() => zoomOut({ duration: 200 })} className={classes.controlBtn}>
          <img src={ZoomOutIcon} alt="ZoomOutIcon" />
        </div>
      </div>
      <Background
        style={{
          backgroundColor: highlightedNodes
            && !!highlightedNodes.length
            ? '#C5DEEA'
            : '#E7F3F7',
        }}
        color="#aaa"
        gap={12}
      />
    </ReactFlow>
  );
};

const CanvasView = ({
  classes,
  model,
  nodes,
  edges,
  onConnect,
  onNodesChange,
  onEdgesChange,
  highlightedNodes,
  graphViewConfig,
}) => {
  const dispatch = useDispatch();
  const categories = useSelector( selectCategories );
  return (
    <>
      <div className={classes.mainWindow}>
        <LegendView
          categoryItems={categories}
        />
        <ActionLayer  />
        <ReactFlowProvider>
          <CustomFlowView
            model={model}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            classes={classes}
            highlightedNodes={highlightedNodes}
            graphViewConfig={graphViewConfig}
            onGraphPanelClick={() => dispatch(reactFlowPanelClicked)}
          />
        </ReactFlowProvider>
      </div>
    </>
);
}

export default withStyles(Styles)(CanvasView);
