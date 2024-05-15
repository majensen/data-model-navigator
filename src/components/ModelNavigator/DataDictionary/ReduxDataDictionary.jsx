import React from 'react';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { setGraphView } from './Store/actions/graph';
// import DataDictionaryController from './DataDictionaryController';
import DataDictionary from './DataDictionary';

const ReduxDataDictionary = (props) => {
  const { model } = props;
  if (!model) {
    return ( <CircularProgress /> );
  }

  return ( <DataDictionary {...props} /> );
};

const mapStateToProps = (state) => ({
  isGraphView: state.ddgraph.isGraphView,
  model: state.submission.model,
});

const mapDispatchToProps = (dispatch) => ({
  onSetGraphView: (isGraphView) => dispatch(setGraphView(isGraphView)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReduxDataDictionary);
