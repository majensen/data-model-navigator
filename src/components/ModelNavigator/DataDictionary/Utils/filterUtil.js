import _ from 'lodash';
import {
  facetFilters,
  filterOptions,
} from '../../config/nav.config';
import { clearAllFilters } from '../Store/actions/filter';

/**
 * Helper function (you mean HACK)  to query and get an object from the redux store
 * @param {string} storeKey name of store property to access
 * @param {obj} store the application redux store
 * @return {obj}
 */
export const getState = (storeKey, store) => store.getState()[storeKey];

/**
 * Helper function to return an object of all selectable filters
 * @param {object} data custodian data containing filter value information
 * @return {obj}
 */
export function allFilters() {
  // returns { category:[], assignment:[], class:[], inclusion:[], uiData:[] }
  const emptyFilters = facetFilters.reduce((acc, facet) => (
    { ...acc, [facet.datafield]: [] }
  ), {});
  return emptyFilters; //Obj of arrs
}

export const getAllFilters = (data) => {
  const emptyFilters = data.reduce((acc, facet) => (
    { ...acc, [facet.datafield]: [] }
  ), {});
  return emptyFilters; //Obj of arrs
};

// data (a.k.a "payload") - an element of facetFilters

// you're not creating variables.
// ckbox_data = {
//   groupName: item.groupName,
//   section: item.section,
//   name: item.name,
//   datafield: item.datafield,
//   isChecked: !item.isChecked,
// };
export const createFiltersFromChecked = (ckbox_data, currentActiveFilters) => {
  const filter = Object.entries(currentActiveFilters).reduce((acc, [thisFacetName]) => {
    if (ckbox_data.datafield === thisFacetName) {
      return ckbox_data.isChecked
        ? { ...acc, [thisFacetName]: [...currentActiveFilters[thisFacetName], ...[ckbox_data.name]] }
      : { ...acc, [thisFacetName]:
          currentActiveFilters[thisFacetName].filter((item) => item !== ckbox_data.name) };
    }
    return { ...acc, [thisFacetName]: currentActiveFilters[thisFacetName] };
  }, {});
  return filter; //Arr of kvs
};


// filterSections - from nav.config.js - lc handles for each of the
// controls in the facet area
// this routine indicates that a "filterHashMap" just
// has simple string keys (filter options), so it's not even a "hash" map,
// and values which are Arrays of pairs (the node handle and the node).
// could be a simple Object with simple node values. -- How? Because the nodes
// include their own names as attributes, that's how.

// FacetFilter (e.g., "Filter By Nodes")
//   FilterSection (e.g. "Category")
//     FilterOption (e.g. "Administrative") 

// so the "hashMap" is indexing Nodes by filterOption (lowest level, chosen by checking ckbox)
// collect nodes, not key-node pairs
// now a "hashMap" is just an Object whose keys are filterOptions and values are
// Arrays of model nodes.
export const initializeFilterHashMap = (model, filterSections) => {
  let hMap = {}; // new Map();
  // 'options' are tag values
  filterOptions.forEach((option) => { hMap[option] = [];}); // hashMap.set(option, []));
  model.nodes()
    .forEach((node) => {
      filterSections.forEach( (section) => {
        // these sections are about nodes
        const opt = node.tags(_.capitalize(section));
        switch (section) {
        case 'category':
        case 'assignment':
        case 'class':
          if (opt.length > 0) {
            hMap[opt].push(node);
          }
          break;
        // these sections are about props of nodes
        case 'uiDisplay':
        case 'inclusion': {
          // determine for which filter options a node has props defined
          let node_options = new Set();
          node.props()
            .flatMap( (p) => p.tags() )
            .map( (t) => t[0] )
            .forEach( (opt) => { node_options.add(opt); });
          node_options
            .forEach((opt) => {
              hMap[opt].push(node);
              // if (hashMap.get(opt)) {
              //   hashMap.set(opt,[...hashMap.get(opt), ...[[node.handle, node]] ]);
              // }
            });
          break;
        }
        default:
          break;
        }});
      });
  return hMap; // Obj of arrs of nodes
};

// new handle explorer filter - what?
// this emits the vaunted "filteredDictionary"

//eliminate these Arrays of key-value pairs
// changed name from newHandleExplorerFilter
// the "filteredDictionary" is just (eventually) an Object of model nodes with
// their handles as keys,  or an Array of nodes
export const makeFilteredDictionary = (selectedFilters, filterHashMap) => {
  let filteredDict = [];
  let alternateFilteredDict = [];

  //filters- object that could have keys that are filteredDict keys
  // terrible name - this doesn't say anything
  const includeMultiFilterValue = (filteredDict, filters) => {
    // filteredDict - an array of model nodes
    const filterValue = filteredDict.filter(
      (node) => filters.some( f => node.props()
                              .flatMap( p => p.tags()
                                        .map(([,opt]) => opt))
                              .includes(f) > 0 )
    );
    return filterValue; // Arr of nodes
  };

  // so, in this beautiful data structure "selectedFilters", evidently the
  // first and second elements of an array are secretly special.
  // builds the "filteredDict"
  selectedFilters.forEach(([section, optarr], index) => {
    switch (index) {
      case 0: {
        optarr.forEach((opt) => {
          filteredDict = filteredDict.concat(filterHashMap[opt.toLowerCase()]);
        });
        break;
      }
      case 1: {
        if (section === 'inclusion' || section === 'uiDisplay') {
          if (optarr.length > 1) {
            filteredDict = includeMultiFilterValue(filteredDict, optarr);
          } else {
            optarr.forEach((opt) => {
              alternateFilteredDict = filteredDict.filter( (node) => 
                
                [
                ...filteredDict.filter(
                  ([, thisValue]) => thisValue[section]
                    && thisValue[section][opt.toLowerCase()]
                    && thisValue[section][opt.toLowerCase()].length > 0)
                ]);
            });
            filteredDict = alternateFilteredDict;
          }
          break;
        }
        optarr.forEach((filterValue) => {
          const valueFilteredDict = filteredDict.filter(
            ([, thisValue]) => thisValue[section] === filterValue.toLowerCase());
          const updateValueFilteredDict = (valueFilteredDict.length > 0)
                ? valueFilteredDict
                : [...filteredDict, ...filterHashMap.get(filterValue.toLowerCase())];
          alternateFilteredDict = [
            ...alternateFilteredDict,
            ...updateValueFilteredDict,
          ];
        });
        filteredDict = alternateFilteredDict;
        break;
      }

      default: {
        if (section === 'inclusion' || section === 'uiDisplay') {
          if (optarr.length > 1) {
            filteredDict = includeMultiFilterValue(filteredDict, optarr);
          } else {
            optarr.forEach((filterValue) => {
              alternateFilteredDict = [
                ...filteredDict.filter(
                  ([, thisValue]) => thisValue[section]
                    && thisValue[section][filterValue.toLowerCase()]
                    && thisValue[section][filterValue.toLowerCase()].length > 0),
              ];
            });
            filteredDict = alternateFilteredDict;
          }
          break;
        }
        optarr.forEach((filterValue) => {
          const valueFilteredDict = filteredDict.filter(
            ([, thisValue]) => thisValue[section] === filterValue.toLowerCase());
          filteredDict.push(...valueFilteredDict);
        });
        break;
      }
    }
  });

  return Object.fromEntries(filteredDict); //returns an Object
};

// subjectCountObj returned from generateSubjectcontsAndFilterData...
export const setSubjectCount = (facetFilters, subjectCountObj) => facetFilters.map((section) =>
  ({
    ...section,
    checkboxItems: section.checkboxItems.map((item) =>
      ({ ...item, subjects:subjectCountObj[item.name.toLowerCase()]})
    ),
  })
);

export const getSubjectItemCount = (model, filterBy = facetFilters) => {
  const subjectCountItems = {};
  filterBy.forEach((section) => {
    section.checkboxItems.forEach((item) => {
      const key = String(item.name).toLowerCase();
      subjectCountItems[key] = model.tagged_items(item.group, key)
        .filter( (item) => item._kind == 'Node' ).length;
      // subjectCountItems[key] = 0;
      // dictionary.nodes().forEach((node) => {
        // item.group = category (bento/dataDictionaryData.js)
        // const property = dictionary[elem][item.group];
        // if (Array.isArray(property)) {
        //   subjectCountItems[key] += property.length;
        // } else if (property === key) {
        //   subjectCountItems[key] += 1;
        // }
      });
    });
  return subjectCountItems;
};


const subjectCountBasedOnExclusionAndInclusionFilter = (
  processedFilters,
  filterHashMap,
  selectedSections,
  filteredDictionary,
  allActiveFilters,
  currentFilter,
) => {

  let inclusionDictionary = [];
  processedFilters.forEach(([key, value]) => {
    value.forEach( (val) => {
      inclusionDictionary.push(...filterHashMap.get(val.toLowerCase()));
    });
  });
  inclusionDictionary = Object.fromEntries(inclusionDictionary); //now this in an object.
  const inclusionSectionCounts = getSubjectItemCount(inclusionDictionary, selectedSections);
  const selectedSectionCounts = getSubjectItemCount(filteredDictionary, selectedSections);
  const filteredDictCounts = getSubjectItemCount(filteredDictionary);

  // display all unselected filter items for category inclusive of the class or assignment filter.
  if (processedFilters.length === 2) {
    for (const [key, value] of Object.entries(selectedSectionCounts)) {
      const categoryItem = allActiveFilters.category.filter((item) => item.toLowerCase() === key);
      if (value === 0 && categoryItem.length === 0) {
        selectedSectionCounts[key] = inclusionSectionCounts[key];
      }
    }
    const combinedSubjectCounts = { ...filteredDictCounts, ...selectedSectionCounts };
    return { subjectCounts: combinedSubjectCounts, dictionary: filteredDictionary };
  }

  if (processedFilters.length > 2) {
    const currentSelection = selectedSections.filter((item) => item.datafield === currentFilter.datafield)[0];
    const otherFilters = processedFilters.filter((item) => item[0] !== currentFilter.datafield);
    const otherInclusionDictionary = makeFilteredDictionary(otherFilters, filterHashMap);
    const otherSelectionCounts = getSubjectItemCount(otherInclusionDictionary, selectedSections);
    if (currentSelection) {
      currentSelection.checkboxItems.forEach((item) => {
        const key = item.name.toLowerCase();
        if (selectedSectionCounts[key] == 0) {
          selectedSectionCounts[key] = otherSelectionCounts[key];
        }
      });
    }

    const combinedSubjectCounts = { ...filteredDictCounts, ...selectedSectionCounts };
    return { subjectCounts: combinedSubjectCounts, dictionary: filteredDictionary };
  }
  return null;
};

//* * filter subject count and filter dictionary*/
//* * uses case base appraoch for subject count and dictionary filter */
// evidently, 'data' can be state, or a "dictionary" (not a model):
// DataDictionary/Store/reducers/filter.js
//   9:  generateSubjectCountsAndFilterData,
//  98:  const filtered = generateSubjectCountsAndFilterData(state, allActiveFilters, payload);
// 121:      filtered = generateSubjectCountsAndFilterData(dictionary);
// 151:      filtered = generateSubjectCountsAndFilterData(state.unfilteredDictionary);

export const generateSubjectCountsAndFilterData = (
  args,
  allActiveFilters = allFilters({}),
  currentFilter
) => {
  const processedFilters = Object.entries(allActiveFilters)
    .filter(([, value]) => value.length > 0);
  //* * initial state when there ARE no active filters */

  // essentially polymorphic based on arg signature.
  // here, evidently, if unfilteredDictionary is not set, the inference is that
  // arg 'data' is not state, but a dictionary.
  const {
    model,
    filterHashMap,
    facetfilterConfig,
    properties,
  } = args;
  
  if (processedFilters.length == 0) {
    return { subjectCounts: getSubjectItemCount(model), model };
  }

  //* * check active filters */
  const filterSections = processedFilters.map((item) => item[0]);
  const selectedSections = facetfilterConfig.facetFilters.filter((section) => filterSections
    .indexOf(section.datafield) !== -1);

  const filteredDictionary = makeFilteredDictionary(processedFilters, filterHashMap);
  const filteredDictCounts = getSubjectItemCount(filteredDictionary);

  const { inclusion, uiDisplay } = allActiveFilters;
  //* * if any inclusion filter is active - inclusion behavior for both filter by inclusion and nodes */

  // evidently, if we get here, 'data' is state
  if (inclusion?.length > 0 || uiDisplay?.length > 0) {
    return inclusionFilterHelper(args, allActiveFilters, currentFilter);
  }
  //* * filter by only nodes - any search filter item that filters the node (this excludes inclusion) */
  //* * filter by only one subject or one section */
  if (processedFilters.length == 1) {
    const selectedSectionCounts = getSubjectItemCount(model, selectedSections);
    const combinedSubjectCounts = { ...filteredDictCounts, ...selectedSectionCounts };
    return { subjectCounts: combinedSubjectCounts, dictionary: filteredDictionary };
  }
  //* * multiple filter - apply case based inclusion and exclusion filter mehtod for subject count */
  const subjectCount = subjectCountBasedOnExclusionAndInclusionFilter(processedFilters,
    filterHashMap, selectedSections, filteredDictionary, allActiveFilters, currentFilter);
  if (subjectCount) return subjectCount;

  const selectedSectionCounts = getSubjectItemCount(filteredDictionary, selectedSections);
  const combinedSubjectCounts = { ...filteredDictCounts, ...selectedSectionCounts };
  //* * filter by multiple sections */
  return { subjectCounts: combinedSubjectCounts, dictionary: filteredDictionary };
};

/** * toggle check box action */
export const toggleCheckBoxAction = (payload, state) => {
  const currentAllFilters = payload === {} ? allFilters()
    : createFiltersFromChecked(payload, state.allActiveFilters);
  if (_.isEqual(currentAllFilters, allFilters())) {
    clearAllFilters();
  }
  return currentAllFilters;
};

/**
 * sort hierarchy order of filter nodes
 */
export const setNodeHierarchy = (dictionary, nodeHierarchy) => {
  const nodes = nodeHierarchy.reduce((result, key) => {
    if (dictionary[key]) {
      result[key] = _.cloneDeep(dictionary[key]);
    }
    return result;
  }, {});
  return nodes;
}

/**
 * Sets the active filters  group checkboxes  isChecked to true.
 */
export function setSelectedValuesToTrue(checkboxItems, filters) {
  const result = checkboxItems.map((checkboxItem) => {
    if (filters.includes(checkboxItem.name)) return { ...checkboxItem, isChecked: true };
    return checkboxItem;
  });
  return result;
}

/**
 * Sets the active filters checkboxes isChecked to true.
 */
export function setSelectedFilterValues(checkboxData, filters) {
  const result = checkboxData.map((filterGroup) => {
    if (Array.isArray(filters[filterGroup.datafield])
     && filters[filterGroup.datafield].length !== 0) {
      return {
        groupName: filterGroup.groupName,
        checkboxItems: setSelectedValuesToTrue(
          filterGroup.checkboxItems,
          filters[filterGroup.datafield],
        ),
        datafield: filterGroup.datafield,
        show: filterGroup.show,
        section: filterGroup.section,
        tooltip: filterGroup.tooltip,
      };
    }
    return filterGroup;
  });
  return result;
}

const filterNodesByProperty = (property = [], inclusionFilter, model) => {
  let filterProps = [];
  if (property.length == 0) {
    property = model.props();
  }

  inclusionFilter.forEach(([key, items]) => {
    const toLowerCase = items.map(e => e.toLowerCase());
    if (key === 'inclusion') {
      filterProps = filterProps.filter((item) => toLowerCase.indexOf(item.propertyType) !== -1);
    } else {
      filterProps = filterProps.filter((item) => toLowerCase.indexOf(item.display) !== -1);
      
    }
  });
  const filterDictionary = {};
  property.forEach(prop => {
    let cat = prop.tags("Category");
    if (!filterDictionary[cat]) {
      filterDictionary[cat] = model.props(cat); // <- this doesn't make sense in original code
    }
  });
  return filterDictionary;
}

const getPropertySubjectCountAndFilterDictionary = (model, inclusionFilter) => {
  const subjectCount = {};
  // get properties from node present on dictionary
  let filterProps = model.props();
  if (inclusionFilter.length > 1) {
    inclusionFilter.forEach(([key, items]) => {
      const lcFilterItems = items.map(e => e.toLowerCase());
      if (key === 'inclusion') {
        filterProps = filterProps.filter(
          (prop) => lcFilterItems.indexOf(prop.tags('inclusion')) !== -1
        );
      } else {
        filterProps = filterProps.filter(
          (prop) => lcFilterItems.indexOf(prop.tags('uiDisplay')) !== -1
        );
      }
    });
    filterProps.forEach((prop) => {
      const incValue = prop.tags('inclusion');
      const dispValue = prop.tags('uiDisplay');
      if (!subjectCount[dispValue]) {
        subjectCount[dispValue] = 0;
      };
      subjectCount[dispValue] += 1;
      if (!subjectCount[incValue]) {
        subjectCount[incValue] = 0;
      };
      subjectCount[incValue] += 1;
    });
    const filterDictionary = filterNodesByProperty(filterProps, inclusionFilter, model);
    
    return { count: subjectCount, dictionary: filterDictionary };
  }
  
  inclusionFilter.forEach(([, items]) => {
    const lcFilterItems = items.map(e => e.toLowerCase());
    
    filterProps.forEach(prop => {
      const incValue = prop.tags('inclusion');
      const dispValue = prop.tags('uiDisplay');
      lcFilterItems.forEach(item => {
        if (dispValue == item
            || incValue == item) {
          if (!subjectCount[dispValue]) {
            subjectCount[dispValue] = 0;
          }
          subjectCount[dispValue] += 1;
          if (!subjectCount[incValue]) {
            subjectCount[incValue] = 0;
          }
          subjectCount[incValue] += 1;
        }
      });
    });
  });
  const filterDictionary = filterNodesByProperty(filterProps, inclusionFilter, model);
  return { count: subjectCount, dictionary: filterDictionary };
};

const inclusionFilterHelper = (args, allActiveFilters, currentFilter) => {
    const processedFilters = Object.entries(allActiveFilters)
        .filter(([, value]) => value.length > 0);
    //** initial state when there is no active filters */
  const {
    model,
    filterHashMap,
    facetfilterConfig,
    properties
  } = args;
    if (processedFilters.length == 0) {
        return { subjectCounts: getSubjectItemCount(model), model };
    }

    //** check active filters */
    const filterSections = processedFilters.map((section) => section[0]);
    const selectedSections = facetfilterConfig.facetFilters.filter(section => filterSections
        .indexOf(section.datafield) !== -1);

    let filteredDictionary = makeFilteredDictionary(processedFilters, filterHashMap);
    const filteredDictCounts = getSubjectItemCount(filteredDictionary);

    //** if any inclusion filter is active - inclusion behavior for both filter by inclusion and nodes */
    const { inclusion, uiDisplay } = allActiveFilters;
    // create new dictionary to track properties count only
    const currentSelectedSection = facetfilterConfig.facetFilters.filter(section => section.datafield === currentFilter.datafield);
    const inclusionItem = 'inclusion';
    const uiDisplayItem = 'uiDisplay';

    const activeInclusionFilter = (currentFilter.datafield === inclusionItem || currentFilter.datafield === uiDisplayItem);

    const inclusionSections = facetfilterConfig.facetFilters.filter(section => (section.datafield
        === inclusionItem || section.datafield === uiDisplayItem));
    const filterByUiDisplay = processedFilters.filter(section => (section[0] === uiDisplayItem));
    const filterByInclusion = processedFilters.filter(section => (section[0] === inclusionItem || section[0] === uiDisplayItem));
    const filterWithoutInclusion = processedFilters.filter(section => (section[0] !== inclusionItem && section[0] !== uiDisplayItem));

    //** generate inclusion filtered dictionary */
    const inclusionDictionary = makeFilteredDictionary(filterByInclusion, filterHashMap);
    const noneInclusionDictionary = makeFilteredDictionary(filterWithoutInclusion, filterHashMap);
    //** select exclusion filter dictionary filteredDictionary if filter item is more than 2 */
    const selectDictionary = (processedFilters.length < 4) ? inclusionDictionary : filteredDictionary;

    const selectedSectionCounts = getSubjectItemCount(selectDictionary, selectedSections, currentFilter);
    const inclusionFilterItems = facetfilterConfig.facetFilters.filter(section => section.datafield === inclusionItem)[0];
    const uiDisplayFilterItems = facetfilterConfig.facetFilters.filter(section => section.datafield === uiDisplayItem)[0];

    let facetSectionCount = filteredDictCounts;
    let propsFilter = getPropertySubjectCountAndFilterDictionary(model, filterByInclusion);
    let inclusionSubjectCount = propsFilter.count;

  // the rest of this mess is a series of if stmts handling the following cases:
  // - filterByInclusion.length === 2 && filterWithoutInclusion.length == 0
  // - filterByInclusion.length === 1 && filterWithoutInclusion.length === 0
  // - filterByInclusion.length === 2 && filterWithoutInclusion.length === 1
  // - filterByInclusion.length === 1 && filterWithoutInclusion.length === 1
  // - filterByInclusion.length === 2 && filterWithoutInclusion.length === 2
  // - filterByInclusion.length === 1 && filterWithoutInclusion.length === 2
  // - filterWithoutInclusion.length > 2
  
    //** When all inclusion facet search filter are active*/
    if (filterByInclusion.length === 2 && filterWithoutInclusion.length == 0) {
        const filter = getPropertySubjectCountAndFilterDictionary(model, filterByInclusion);
        inclusionSubjectCount = filter.count;
        filteredDictionary = filter.dictionary;
        const otherFilterItem = (currentFilter.datafield !== inclusionItem)
            ? inclusionFilterItems : uiDisplayFilterItems;
        otherFilterItem.checkboxItems.forEach(item => {
            filteredDictCounts[item.group] = inclusionSubjectCount[item.group]
                ? inclusionSubjectCount[item.group] : 0;
        });
        const currentrFilter = filterByInclusion.filter(item => (item[0] !== currentFilter.datafield));
        const allInclusionFilterItem = [["inclusion", ["Preferred", "Required", "Optional"]],
        ...filterByUiDisplay];
        const inclusionFilters = (!activeInclusionFilter) ? allInclusionFilterItem : currentrFilter;
        const currentPropsFilter = getPropertySubjectCountAndFilterDictionary(model, inclusionFilters);
        const currentPropsFilterCount = currentPropsFilter.count;
        facetSectionCount = getSubjectItemCount(filter.dictionary);
        inclusionFilterItems.checkboxItems.forEach(item => {
            facetSectionCount[item.group] = currentPropsFilterCount[item.group] ? currentPropsFilterCount[item.group] : 0;
        });
        uiDisplayFilterItems.checkboxItems.forEach(item => {
            facetSectionCount[item.group] = currentPropsFilterCount[item.group] ? currentPropsFilterCount[item.group] : 0;
        });
        const combinedSubjectCounts = Object.assign({}, facetSectionCount, inclusionSubjectCount);
        return { subjectCounts: combinedSubjectCounts, dictionary: filteredDictionary };
    }

    if (filterByInclusion.length === 1 && filterWithoutInclusion.length === 0) {
        //filter dictionary by inclusion
        const nonInclusionSectionCounts = getSubjectItemCount(model, selectedSections);
        const filter = getPropertySubjectCountAndFilterDictionary(model, filterByInclusion);
        inclusionSubjectCount = filter.count;
        if ((inclusion.length > 0 && uiDisplay.length === 0)) {
            uiDisplayFilterItems.checkboxItems.forEach(item => {
                filteredDictCounts[item.group] = inclusionSubjectCount[item.group]
                    ? inclusionSubjectCount[item.group] : 0;
            });
        }
        if (uiDisplay.length > 0 && inclusion.length === 0) {
            inclusionFilterItems.checkboxItems.forEach(item => {
                filteredDictCounts[item.group] = inclusionSubjectCount[item.group]
                    ? inclusionSubjectCount[item.group] : 0;
            });
        }
        const combinedSubjectCounts = Object.assign({}, filteredDictCounts, nonInclusionSectionCounts);
        return { subjectCounts: combinedSubjectCounts, dictionary: filteredDictionary };
    }

    //** when inclusion by filter is two and node facet section is one */
    if (filterByInclusion.length === 2 && filterWithoutInclusion.length === 1) {
        //** chcek if the current filter inclusion filter */
        if (activeInclusionFilter) {
            /** get current filter  */
            const currentInclusionSection = filterByInclusion.filter((item) => item[0] !== currentFilter.datafield);
            const currentInclusionFilter = getPropertySubjectCountAndFilterDictionary(filteredDictionary, currentInclusionSection);
            let inclusionFilterOnFilteredDictionary = getPropertySubjectCountAndFilterDictionary(filteredDictionary, filterByInclusion);
            const inclusionSubjectCount = inclusionFilterOnFilteredDictionary.count;
            // ** adjust inclusion subject count with node filter */
            const allInclusionFilterItem = [["inclusion", ["Preferred", "Required", "Optional"]],
            ...filterByUiDisplay];

            //** get count for all the inclusion subject */
            const allInclusionFilters = getPropertySubjectCountAndFilterDictionary(noneInclusionDictionary, allInclusionFilterItem);
            const allInclusionSubjectCount = allInclusionFilters.count;

            //**  get count for only active inclusion fiters*/
            const activeInclusionFilters = getPropertySubjectCountAndFilterDictionary(filteredDictionary, filterByInclusion);
            const activeInclusionSubjectCount = activeInclusionFilters.count;

            const inclusionFilterOnUnFilteredDictionary = getPropertySubjectCountAndFilterDictionary(model, filterByInclusion);
            const subjectCount1 = getSubjectItemCount(inclusionFilterOnFilteredDictionary.dictionary);
            const subjectCount2 = getSubjectItemCount(inclusionFilterOnUnFilteredDictionary.dictionary);

            // update the subject
            const overideSubjectCount = {};
            //** update the inclusion subject count base on active or all inclusion filter */
            inclusionFilterItems.checkboxItems.forEach(item => {
                inclusionSubjectCount[item.group] = activeInclusionSubjectCount[item.group]
                    ? activeInclusionSubjectCount[item.group] : allInclusionSubjectCount[item.group];
            });
            uiDisplayFilterItems.checkboxItems.forEach(item => {
                inclusionSubjectCount[item.group] = activeInclusionSubjectCount[item.group]
                    ? activeInclusionSubjectCount[item.group] : allInclusionSubjectCount[item.group];
            });
            Object.keys(subjectCount1).forEach(key => {
                overideSubjectCount[key] = (subjectCount1[key] > 0) ? subjectCount1[key] : subjectCount2[key];
            });
            const combinedSubjectCounts = Object.assign({}, overideSubjectCount, inclusionSubjectCount);
            return { subjectCounts: combinedSubjectCounts, dictionary: inclusionFilterOnFilteredDictionary.dictionary };

        }
        //** when node filter facet is current selection */
        if (!activeInclusionFilter) {
          //** if the filter section facet is not inclusion */

          /// this?? is where an inclusionFilter is actually created? at line 241 in the middle of a
          /// jungle of cruft?
          
            const inclusionFilter = getPropertySubjectCountAndFilterDictionary(inclusionDictionary, filterByInclusion);
            facetSectionCount = getSubjectItemCount(inclusionFilter.dictionary);
            const filterByNodeInclusion = getPropertySubjectCountAndFilterDictionary(noneInclusionDictionary, filterByInclusion);
            let subjectCount = getSubjectItemCount(filterByNodeInclusion.dictionary);
            // ** adjust inclusion subject count with node filter */
            const allInclusionFilterItem = [["inclusion", ["Preferred", "Required", "Optional"]],
            ...filterByUiDisplay];

            //** get count for all the inclusion subject */
            const allInclusionFilters = getPropertySubjectCountAndFilterDictionary(noneInclusionDictionary, allInclusionFilterItem);
            const allInclusionSubjectCount = allInclusionFilters.count;

            //**  get count for only active inclusion fiters*/
            const activeInclusionFilters = getPropertySubjectCountAndFilterDictionary(filteredDictionary, filterByInclusion);
            const activeInclusionSubjectCount = activeInclusionFilters.count;

            const overideSubjectCount = {};
            //** update the inclusion subject count base on active or all inclusion filter */
            inclusionFilterItems.checkboxItems.forEach(item => {
                overideSubjectCount[item.group] = activeInclusionSubjectCount[item.group]
                    ? activeInclusionSubjectCount[item.group] : allInclusionSubjectCount[item.group];
            });
            uiDisplayFilterItems.checkboxItems.forEach(item => {
                overideSubjectCount[item.group] = activeInclusionSubjectCount[item.group]
                    ? activeInclusionSubjectCount[item.group] : allInclusionSubjectCount[item.group];
            });

            //** update the subject count for the current section */
            const currentSelection = selectedSections.filter(item => item.datafield === currentFilter.datafield)[0];
            if (currentSelection) {
                currentSelection.checkboxItems.forEach(item => {
                    const key = item.name.toLowerCase();
                    overideSubjectCount[key] = facetSectionCount[key];
                });
            } else {
                // update the last checked section of filter by node
                subjectCount = getSubjectItemCount(filteredDictionary);
                const activeSection = facetfilterConfig.facetFilters.filter(section => filterWithoutInclusion[0][0]
                    .includes(section.datafield));
                activeSection[0].checkboxItems.forEach(item => {
                    const key = item.name.toLowerCase();
                    overideSubjectCount[key] = facetSectionCount[key];
                });
            }
            const combinedSubjectCounts = Object.assign({}, subjectCount, overideSubjectCount);
            //set filtered dcitionary based on node and inclusion filter
            filteredDictionary = activeInclusionFilters.dictionary;
            //return filtered dictionary and subject count
            return { subjectCounts: combinedSubjectCounts, dictionary: filteredDictionary };
        }
    }

    if (filterByInclusion.length === 1 && filterWithoutInclusion.length === 1) {
        const allInclusionFilterItem = [["inclusion", ["Preferred", "Required", "Optional"]],
        ["uiDisplay", ["Yes", "No"]]];
        const allInclusionFilter = getPropertySubjectCountAndFilterDictionary(noneInclusionDictionary, allInclusionFilterItem);
        const currentPropsFilterCount = allInclusionFilter.count;

        const selectedInclusionFilter = getPropertySubjectCountAndFilterDictionary(noneInclusionDictionary, filterByInclusion);
        const selectedInclusionFilterCount = selectedInclusionFilter.count;
        const overideSubjectCount = {};
        if (uiDisplay.length > 0){
            inclusionFilterItems.checkboxItems.forEach(item => {
                overideSubjectCount[item.group] = selectedInclusionFilterCount[item.group]
                    ? selectedInclusionFilterCount[item.group] : 0;
            });
            uiDisplayFilterItems.checkboxItems.forEach(item => {
                overideSubjectCount[item.group] = currentPropsFilterCount[item.group]
                    ? currentPropsFilterCount[item.group] : 0;
            });
        } else {
            uiDisplayFilterItems.checkboxItems.forEach(item => {
                overideSubjectCount[item.group] = selectedInclusionFilterCount[item.group]
                    ? selectedInclusionFilterCount[item.group] : 0;
            });
            inclusionFilterItems.checkboxItems.forEach(item => {
                overideSubjectCount[item.group] = currentPropsFilterCount[item.group]
                    ? currentPropsFilterCount[item.group] : 0;
            });
        }
        //** set current section with filter by inclusion */
        const nonInclusionSectionCounts = getSubjectItemCount(inclusionDictionary, selectedSections);
        const combinedSubjectCounts = Object.assign({}, filteredDictCounts, nonInclusionSectionCounts, overideSubjectCount);
        return { subjectCounts: combinedSubjectCounts, dictionary: filteredDictionary };
    }

    if (filterByInclusion.length === 2 && filterWithoutInclusion.length === 2) {
        if (activeInclusionFilter) {
            /** get current filter  */
            const currentInclusionSection = filterByInclusion.filter((item) => item[0] !== currentFilter.datafield);
            const currentInclusionFilter = getPropertySubjectCountAndFilterDictionary(filteredDictionary, currentInclusionSection);
            let inclusionFilterOnFilteredDictionary = getPropertySubjectCountAndFilterDictionary(filteredDictionary, filterByInclusion);
            // const selectedFilterCount = currentInclusionFilter.count;
            const inclusionSubjectCount = inclusionFilterOnFilteredDictionary.count;
            // ** adjust inclusion subject count with node filter */
            const allInclusionFilterItem = [["inclusion", ["Preferred", "Required", "Optional"]],
            ...filterByUiDisplay];

            //** get count for all the inclusion subject */
            const allInclusionFilters = getPropertySubjectCountAndFilterDictionary(noneInclusionDictionary, allInclusionFilterItem);
            const allInclusionSubjectCount = allInclusionFilters.count;

            //**  get count for only active inclusion fiters*/
            const activeInclusionFilters = getPropertySubjectCountAndFilterDictionary(filteredDictionary, filterByInclusion);
            const activeInclusionSubjectCount = activeInclusionFilters.count;

            const inclusionFilterOnUnFilteredDictionary = getPropertySubjectCountAndFilterDictionary(model, filterByInclusion);
            // const subjectCount1 = getSubjectItemCount(inclusionFilterOnFilteredDictionary.dictionary);
            // const subjectCount2 = getSubjectItemCount(inclusionFilterOnUnFilteredDictionary.dictionary);

            // update the subject
            const overideSubjectCount = {};
            //** update the inclusion subject count base on active or all inclusion filter */
            inclusionFilterItems.checkboxItems.forEach(item => {
                inclusionSubjectCount[item.group] = activeInclusionSubjectCount[item.group]
                    ? activeInclusionSubjectCount[item.group] : allInclusionSubjectCount[item.group];
            });
            uiDisplayFilterItems.checkboxItems.forEach(item => {
                inclusionSubjectCount[item.group] = activeInclusionSubjectCount[item.group]
                    ? activeInclusionSubjectCount[item.group] : allInclusionSubjectCount[item.group];
            });

            const otherFilters = filterWithoutInclusion.filter(item => item[0] !== currentFilter.datafield);
            const otherInclusionDictionary = makeFilteredDictionary(otherFilters, filterHashMap);
            const otherFilterByInclusion = getPropertySubjectCountAndFilterDictionary(otherInclusionDictionary, filterByInclusion);
            const otherSelectionCounts = getSubjectItemCount(otherFilterByInclusion.dictionary, selectedSections);
            selectedSections.forEach(section => {
                section.checkboxItems.forEach(item => {
                    const key = item.name.toLowerCase();
                    overideSubjectCount[key] = otherSelectionCounts[key];
                });
            });
            // Object.keys(subjectCount1).forEach(key => {
            //   overideSubjectCount[key] = (subjectCount1[key] > 0) ? subjectCount1[key] : subjectCount2[key];
            // });
            const combinedSubjectCounts = Object.assign({}, overideSubjectCount, inclusionSubjectCount);
            return { subjectCounts: combinedSubjectCounts, dictionary: inclusionFilterOnFilteredDictionary.dictionary };
        } else {
            const inclusionFilter = getPropertySubjectCountAndFilterDictionary(noneInclusionDictionary, filterByInclusion);
            facetSectionCount = getSubjectItemCount(inclusionFilter.dictionary);
            const filterByNodeInclusion = getPropertySubjectCountAndFilterDictionary(noneInclusionDictionary, filterByInclusion);
            let subjectCount = getSubjectItemCount(filterByNodeInclusion.dictionary);
            // ** adjust inclusion subject count with node filter */
            const allInclusionFilterItem = [["inclusion", ["Preferred", "Required", "Optional"]],
            ...filterByUiDisplay];

            //** get count for all the inclusion subject */
            const allInclusionFilters = getPropertySubjectCountAndFilterDictionary(noneInclusionDictionary, allInclusionFilterItem);
            const allInclusionSubjectCount = allInclusionFilters.count;

            //**  get count for only active inclusion fiters*/
            const activeInclusionFilters = getPropertySubjectCountAndFilterDictionary(filteredDictionary, filterByInclusion);
            const activeInclusionSubjectCount = activeInclusionFilters.count;

            //** update the inclusion subject count base on active or all inclusion filter */
            inclusionFilterItems.checkboxItems.forEach(item => {
                subjectCount[item.group] = activeInclusionSubjectCount[item.group]
                    ? activeInclusionSubjectCount[item.group] : allInclusionSubjectCount[item.group];
            });
            uiDisplayFilterItems.checkboxItems.forEach(item => {
                subjectCount[item.group] = activeInclusionSubjectCount[item.group]
                    ? activeInclusionSubjectCount[item.group] : allInclusionSubjectCount[item.group];
            });

            //** update the subject count for the current section */
            const currentSelection = selectedSections.filter(item => item.datafield === currentFilter.datafield)[0];
            if (currentSelection) {
                const otherFilters = filterWithoutInclusion.filter(item => item[0] !== currentFilter.datafield);
                const otherInclusionDictionary = makeFilteredDictionary(otherFilters, filterHashMap);
                const otherFilterByInclusion = getPropertySubjectCountAndFilterDictionary(otherInclusionDictionary, filterByInclusion);
                const otherSelectionCounts = getSubjectItemCount(otherFilterByInclusion.dictionary, selectedSections);
                currentSelection.checkboxItems.forEach(item => {
                    const key = item.name.toLowerCase();
                    subjectCount[key] = otherSelectionCounts[key];
                });
            }
            //set filtered dcitionary based on node and inclusion filter
            filteredDictionary = activeInclusionFilters.dictionary;
            //return filtered dictionary and subject count
            return { subjectCounts: subjectCount, dictionary: filteredDictionary };
        }
    }

    if (filterByInclusion.length === 1 && filterWithoutInclusion.length === 2) {
        const nonInclusionSectionCounts = getSubjectItemCount(noneInclusionDictionary, selectedSections, currentFilter);
        propsFilter = getPropertySubjectCountAndFilterDictionary(filteredDictionary, filterByInclusion);
        inclusionSubjectCount = propsFilter.count;
        const currentSelection = selectedSections.filter(item => item.datafield === currentFilter.datafield)[0];
        const otherFilters = processedFilters.filter(item => item[0] !== currentFilter.datafield);
        const otherInclusionDictionary = makeFilteredDictionary(otherFilters, filterHashMap);
        const otherSelectionCounts = getSubjectItemCount(otherInclusionDictionary, selectedSections, currentFilter);
        if (currentSelection) {
            const overideSubjectCount = {};
            currentSelection.checkboxItems.forEach(item => {
                const key = item.name.toLowerCase();
                overideSubjectCount[key] = otherSelectionCounts[key];
            });
            const filterByPropType = processedFilters.filter(item => (item[0] === inclusionItem));
            const filter = getPropertySubjectCountAndFilterDictionary(noneInclusionDictionary, filterByPropType);
            const filterCount = filter.count;
            uiDisplayFilterItems.checkboxItems.forEach(item => {
                overideSubjectCount[item.group] = filterCount[item.group] ? filterCount[item.group] : 0;
            });
            if (inclusion.length > 0) {
                inclusionFilterItems.checkboxItems.forEach(item => {
                    overideSubjectCount[item.group] = nonInclusionSectionCounts[item.group] ? nonInclusionSectionCounts[item.group] : 0;
                });
                uiDisplayFilterItems.checkboxItems.forEach(item => {
                    overideSubjectCount[item.group] = inclusionSubjectCount[item.group] ? inclusionSubjectCount[item.group] : 0;
                });
            }
            if (uiDisplay.length > 0) {
                uiDisplayFilterItems.checkboxItems.forEach(item => {
                    overideSubjectCount[item.group] = nonInclusionSectionCounts[item.group] ? nonInclusionSectionCounts[item.group] : 0;
                });
                inclusionFilterItems.checkboxItems.forEach(item => {
                    overideSubjectCount[item.group] = inclusionSubjectCount[item.group] ? inclusionSubjectCount[item.group] : 0;
                });
            }
            const combinedSubjectCounts = Object.assign({}, filteredDictCounts, overideSubjectCount);
            return { subjectCounts: combinedSubjectCounts, dictionary: filteredDictionary };
        } else {
            const overideSubjectCount = {};
            const uncheckedSection = facetfilterConfig.facetFilters.filter(item => item.datafield === currentFilter.datafield)[0];
            inclusionFilterItems.checkboxItems.forEach(item => {
                overideSubjectCount[item.group] = inclusionSubjectCount[item.group] ? inclusionSubjectCount[item.group] : 0;
            });
            uiDisplayFilterItems.checkboxItems.forEach(item => {
                overideSubjectCount[item.group] = inclusionSubjectCount[item.group] ? inclusionSubjectCount[item.group] : 0;
            });
            if (currentFilter.datafield === inclusionItem) {
                const inclusionCount = getSubjectItemCount(noneInclusionDictionary);
                uiDisplayFilterItems.checkboxItems.forEach(item => {
                    overideSubjectCount[item.group] = inclusionCount[item.group] ? inclusionCount[item.group] : 0;
                });
            }
            if (currentFilter.datafield === uiDisplayItem) {
                const inclusionCount = getSubjectItemCount(noneInclusionDictionary);
                inclusionFilterItems.checkboxItems.forEach(item => {
                    overideSubjectCount[item.group] = inclusionCount[item.group] ? inclusionCount[item.group] : 0
                });
            }

            const inclusionFilterCounts = getSubjectItemCount(inclusionDictionary);
            const categorySection = facetfilterConfig.facetFilters.filter(item => item.datafield === "category")[0];
            categorySection.checkboxItems.forEach(item => {
                const key = item.name.toLowerCase();
                overideSubjectCount[key] = inclusionFilterCounts[key];
            });
            if (!activeInclusionFilter) {
                if (uncheckedSection) {
                    uncheckedSection.checkboxItems.forEach(item => {
                        const key = item.name.toLowerCase();
                        overideSubjectCount[key] = filteredDictCounts[key];
                    });
                }
            }

            const combinedSubjectCounts = Object.assign({}, filteredDictCounts, overideSubjectCount);
            return { subjectCounts: combinedSubjectCounts, dictionary: filteredDictionary };
        }
    }


    if (filterWithoutInclusion.length > 2) {
        const nonInclusionSectionCounts = getSubjectItemCount(noneInclusionDictionary, selectedSections, currentFilter);
        propsFilter = getPropertySubjectCountAndFilterDictionary(filteredDictionary, filterByInclusion);
        inclusionSubjectCount = propsFilter.count;
        const currentSelection = selectedSections.filter(item => item.datafield === currentFilter.datafield)[0];
        const otherFilters = processedFilters.filter(item => item[0] !== currentFilter.datafield);
        const otherInclusionDictionary = makeFilteredDictionary(otherFilters, filterHashMap);
        const otherSelectionCounts = getSubjectItemCount(otherInclusionDictionary, selectedSections, currentFilter);
        if (currentSelection) {
            const overideSubjectCount = {};
            uiDisplayFilterItems.checkboxItems.forEach(item => {
                overideSubjectCount[item.group] = inclusionSubjectCount[item.group] ? inclusionSubjectCount[item.group] : 0;
            });
            inclusionFilterItems.checkboxItems.forEach(item => {
                overideSubjectCount[item.group] = inclusionSubjectCount[item.group] ? inclusionSubjectCount[item.group] : 0;
            });
            currentSelection.checkboxItems.forEach(item => {
                const key = item.name.toLowerCase();
                overideSubjectCount[key] = otherSelectionCounts[key];
            });
            if (currentSelection && filterByInclusion.length === 2) {
                if (currentFilter.datafield === inclusionItem) {
                    const filterByDisplay = processedFilters.filter(item => (item[0] === uiDisplayItem));
                    const filter = getPropertySubjectCountAndFilterDictionary(noneInclusionDictionary, filterByDisplay);
                    const filterCount = filter.count;
                    inclusionFilterItems.checkboxItems.forEach(item => {
                        overideSubjectCount[item.group] = filterCount[item.group] ? filterCount[item.group] : 0
                    });
                } else {
                    const filterByPropType = processedFilters.filter(item => (item[0] === inclusionItem));
                    const filter = getPropertySubjectCountAndFilterDictionary(noneInclusionDictionary, filterByPropType);
                    const filterCount = filter.count;
                    uiDisplayFilterItems.checkboxItems.forEach(item => {
                        overideSubjectCount[item.group] = filterCount[item.group] ? filterCount[item.group] : 0;
                    });
                }
            }
            if (currentSelection && filterByInclusion.length === 1) {
                if (currentFilter.datafield === inclusionItem) {
                    inclusionFilterItems.checkboxItems.forEach(item => {
                        overideSubjectCount[item.group] = nonInclusionSectionCounts[item.group] ? nonInclusionSectionCounts[item.group] : 0;
                    });
                } else {
                    uiDisplayFilterItems.checkboxItems.forEach(item => {
                        overideSubjectCount[item.group] = nonInclusionSectionCounts[item.group] ? nonInclusionSectionCounts[item.group] : 0;
                    });
                }
            }
            if (currentFilter.datafield === 'category') {
                currentSelection.checkboxItems.forEach(item => {
                    const key = item.name.toLowerCase();
                    overideSubjectCount[key] = otherSelectionCounts[key];
                });
            }
            const combinedSubjectCounts = Object.assign({}, filteredDictCounts, overideSubjectCount);
            return { subjectCounts: combinedSubjectCounts, dictionary: filteredDictionary };
        } else {
            const overideSubjectCount = {};
            if (activeInclusionFilter) {
                if (currentFilter.datafield === inclusionItem) {
                    inclusionFilterItems.checkboxItems.forEach(item => {
                        overideSubjectCount[item.group] = inclusionSubjectCount[item.group] ? inclusionSubjectCount[item.group] : 0;
                    });
                } else {
                    uiDisplayFilterItems.checkboxItems.forEach(item => {
                        overideSubjectCount[item.group] = inclusionSubjectCount[item.group] ? inclusionSubjectCount[item.group] : 0;
                    });
                }
            }
            if (currentFilter.datafield === 'category') {
                const categorySection = facetfilterConfig.facetFilters.filter(item => item.datafield === "category")[0];
                categorySection.checkboxItems.forEach(item => {
                    const key = item.name.toLowerCase();
                    overideSubjectCount[key] = filteredDictCounts[key];
                });
            }
            const combinedSubjectCounts = Object.assign({}, nonInclusionSectionCounts, overideSubjectCount);
            return { subjectCounts: combinedSubjectCounts, dictionary: filteredDictionary };
        }
    }

    const combinedSubjectCounts = Object.assign({}, filteredDictCounts, selectedSectionCounts);
    return { subjectCounts: combinedSubjectCounts, dictionary: filteredDictionary };
}
