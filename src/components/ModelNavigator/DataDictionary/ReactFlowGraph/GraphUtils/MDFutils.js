import _ from "lodash";

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

const generateNodes = (node_objs, edge_objs, config) => {
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
        icon: config.tagAttribute('Category',cat).graph.icon,
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

const generateFlowData = (node_objs, edge_objs, config) => {
  return {
    nodes: generateNodes(node_objs, edge_objs, config),
    edges: generateEdges(edge_objs),
  };
};

export function createNodesAndEdges(model, config) {
  const node_objs = model.nodes()
        .map((node) => ({
          name: node.handle,
          node
        }));

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
      (edge_obj) => edge_obj.target 
    );

  const flowData =  generateFlowData(node_objs, edge_objs, config);
  return flowData;
}
