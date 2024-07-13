import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withStyles } from "@material-ui/core";
import Styles from "./DictionaryStyle";
import Tab from "./Tab";
import TabPanel from "./Tab/TabPanel";
import TabThemeProvider from "./Tab/TabThemeConfig";
import DataDictionaryTable from "../Table/DataDictionaryTable";
import CanvasController from "../ReactFlowGraph/Canvas/CanvasController";
import { graphViewConfig } from '../../Config/nav.config';
import {
  tabGraphViewChanged,
  canvasWidthChanged,
  selectIsGraphView,
} from '../../../../features/graph/graphSlice';

const tabItems = [
  {
    index: 0,
    label: "Graph View",
    value: "graph_view",
  },
  {
    index: 1,
    label: "Table View",
    value: "table_view",
  },
];

const DictionaryView = ({
  classes,
}) => {

  const dispatch = useDispatch();
  const graphView = useSelector( selectIsGraphView );
  const [currentTab, setCurrentTab] = useState(0);
  /**
   * get witdh of the tab to position nodes in the graph view
   */
  const ref = useRef(null);
  const [tabViewWidth, setTabViewWidth] = useState(0);
  const setCanvasWidth = () => {
    dispatch( canvasWidthChanged(ref.current.offsetWidth) );
  };

  useEffect(() => {
    dispatch(canvasWidthChanged(ref.current.offsetWidth));
    window.addEventListener("resize", setCanvasWidth);
    return () => {
      window.removeEventListener("resize", setCanvasWidth);
    };
  });

  useLayoutEffect(() => {
    setTabViewWidth(ref.current.offsetWidth);
  }, []);

  //set to graph view incase of search entry
  useEffect(() => {
    if (graphView) {
      // 0 set for graph view
      setCurrentTab(0);
    }
  }, [graphView]);

  const handleTabChange = (event, value) => {
    setCurrentTab(value);
    dispatch( tabGraphViewChanged(value === 0) );
  };

  return (
    <>
      <TabThemeProvider>
        <div className={classes.container} ref={ref}>
          <div className={classes.tabItems}>
            <Tab
              styleClasses={classes}
              tabItems={tabItems}
              currentTab={currentTab}
              handleTabChange={handleTabChange}
            />
          </div>
          <div className={classes.viewTableOuterContainer}>
            <div className={classes.viewTableContainer}>
              <TabPanel value={currentTab} index={0}>
                <div className={classes.graphView}>
                  <CanvasController
                    tabViewWidth={tabViewWidth}
                    graphViewConfig={graphViewConfig}
                  />
                </div>
              </TabPanel>
              <TabPanel value={currentTab} index={1}>
                <div className={classes.tableView}>
                  <DataDictionaryTable
                    // pdfDownloadConfig={pdfDownloadConfig}
                  />
                </div>
              </TabPanel>
            </div>
          </div>
        </div>
      </TabThemeProvider>
    </>
  );
};

export default   withStyles(Styles)(DictionaryView);
