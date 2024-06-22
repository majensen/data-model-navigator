import _ from "lodash";
import studyIcon from "../../../DataDictionary/ReactFlowGraph/Canvas/assets/graph_icon/study.svg";
import caseIcon from "../../../DataDictionary/ReactFlowGraph/Canvas/assets/graph_icon/case.svg";
import clinicalTrialIcon from "../../../DataDictionary/ReactFlowGraph/Canvas/assets/graph_icon/clinical_trial.svg";
import adminIcon from "../../../DataDictionary/ReactFlowGraph/Canvas/assets/graph_icon/administrative.svg";
import biospecimenIcon from "../../../DataDictionary/ReactFlowGraph/Canvas/assets/graph_icon/biospecimen.svg";
import analysisIcon from "../../../DataDictionary/ReactFlowGraph/Canvas/assets/graph_icon/analysis.svg";
import dataFileIcon from "../../../DataDictionary/ReactFlowGraph/Canvas/assets/graph_icon/data_file.svg";
import clinicalIcon from "../../../DataDictionary/ReactFlowGraph/Canvas/assets/graph_icon/clinical.svg";

const graphIcons = {
  administrative: adminIcon,
  study: studyIcon,
  case: caseIcon,
  clinical_trial: clinicalTrialIcon,
  biospecimen: biospecimenIcon,
  analysis: analysisIcon,
  data_file: dataFileIcon,
  clinical: clinicalIcon,
};

const graphIconColors = {
  administrative: "#9b2e20",
  study: "#9875ff",
  case: "#ff7f16",
  clinical_trial: "#02a1bb",
  biospecimen: "#00785a",
  analysis: "#b533a9",
  data_file: "#00ad0c",
  clinical: "#1b75bc",
};

const generateNodes = (node_objs, edge_objs, windowWidth) => {
  const generatedNodes = node_objs.map((node_o, index) => {
    const cat = node_o.node.tags('Category');
    const nreq = node_o.node.props()
          .filter( (p) => p.tags('Inclusion') === 'required')
          .length;
    const npref = node_o.node.props()
          .filter( (p) => p.tags('Inclusion') === 'preferred')
          .length;
    const nopt = node_o.node.props()
          .filter( (p) => p.tags('Inclusion') === 'optional')
          .length;
    return {
      type: "custom",
      position: { x: 0, y: 0 },
      id: node_o.node.handle,
      category: cat,
      data: {
        label: _.capitalize(node_o.name),
        icon: graphIcons[cat],
        iconColor: graphIconColors[cat],
        category: cat,
        nodeAssignment: _.capitalize(node_o.node.tags('Assignment')),
        nodeClass: _.capitalize(node_o.node.tags('Class')),
        reqPropsCount: nreq,
        prefPropsCount: npref,
        optPropsCount: nopt,
      },
    };
  });
  return generatedNodes;
};

const generateEdges = (edge_objs) => {
  const DEFAULT_EDGE_TYPE = {
    type: "custom",
    animated: false,
  };

  const generatedEdges = edge_objs.map((edge_o, index) => {
    return {
      ...DEFAULT_EDGE_TYPE,
      id: `${edge_o.source.handle}-${edge_o.name}-${edge_o.target.handle}`,
      source: edge_o.source.handle,
      target: edge_o.target.handle,
    };
  });

  return generatedEdges;
};

const generateFlowData = (node_objs, edge_objs) => {
  return {
    nodes: generateNodes(node_objs, edge_objs),
    edges: generateEdges(edge_objs),
  };
};

export function createNodesAndEdges(
  model,
  createAll,
  nodesToHide = ["program"]
) {
  const node_objs = model.nodes()
        .filter( (node) => !nodesToHide.includes(node.handle) )
        .map((node) => ({
          name: node.handle,
          node
        }));

  const hideDb = nodesToHide.reduce((db, name) => {
    db[name] = true;
    return db;
  }, {});

  const edge_objs = node_objs
        .filter((obj) => model.outgoing_edges(obj.node.handle).length > 0) // just outgoing edges, b/c Gen3
    .reduce(
      // add each node's links to the edge list
      (list, obj) => {
        const newLinks = model.outgoing_edges(obj.node.handle).map((edge) => ({
          source: obj.node,
          target: model.nodes(edge.dst),
          name: edge.type,
          exists: 1,
        }));
        return list.concat(newLinks);
      },
      []
    )
    .filter(
      // target type exist and is not in hide list
      (edge_obj) =>
        edge_obj.target 
        && !(edge_obj.target.handle in hideDb)
    );

  const flowData =  generateFlowData(node_objs, edge_objs);
  return flowData;
}
