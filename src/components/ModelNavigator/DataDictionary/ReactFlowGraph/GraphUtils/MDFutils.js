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
          .filter( (p) => p.tags('inclusion') === 'required')
          .length;
    const npref = node_o.node.props()
          .filter( (p) => p.tags('inclusion') === 'preferred')
          .length;
    const nopt = node_o.node.props()
          .filter( (p) => p.tags('inclusion') === 'optional')
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

/**
 * Given a data dictionary that defines a set of nodes
 *    and edges, returns the nodes and edges in correct format
 *
 * @method createNodesAndEdges
 * @param props: Object (normally taken from redux state) that includes model
 *    property (MDFReader object)  as well as other optional properties
 *    such as counts_search and links_search (created by getCounts) with
 *    information about the number of each type (node) and edge (between
 *    nodes with a link's source and target types) that actually
 *    exist in the model
 * @param createAll: Include all nodes and edges or only those that are populated in
 *    counts_search and links_search
 * @param nodesToHide: Array of nodes to hide from graph
 * @returns { node_objs, edge_objs } Object containing annotated model nodes and edges
 */
export function createNodesAndEdges(
  props,
  createAll,
  nodesToHide = ["program"]
) {
  const model = globalThis.model; // eslint-disable-line no-undef
  const node_objs = model.nodes()
        .filter( (node) => !nodesToHide.includes(node.handle) )
        .map((node) => {
          let count = 0;
          if (props.counts_search) {
            count = props.counts_search[`_${node.handle}_count`];
          }
          return {
            name: node.handle,
            count,
            node
          };
        })
        .filter((node_obj) => createAll || node_obj.count !== 0);

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
    )
    .map((edge_obj) => {
      // decorate each link with its "exists" count if available
      //  (number of instances of link between source and target types in the data)
      const res = edge_obj;
      res.exists = props.links_search
        ? props.links_search[
            `${res.source.handle}_${res.name}_to_${res.target.handle}_link`
          ]
        : undefined;
      return res;
    })
    .filter(
      // filter out if no instances of this link exists and createAll is not specified
      (edge_obj) => createAll || edge_obj.exists || edge_obj.exists === undefined
    );

  const flowData =  generateFlowData(node_objs, edge_objs);
  return flowData;
}
