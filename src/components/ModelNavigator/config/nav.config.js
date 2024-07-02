// execute with config object defining the arguments below
// returns getter function, which is provided in ConfigContext

import resetIconSVG from '../../../assets/icons/Clear-icon.svg';
import legendDefaultIcon from '../../../assets/icons/icon_default.svg';
import categoryDefaultIcon from '../../../assets/icons/icon_default.svg';

export const createConfig = ({
  facetSections,
  facetFilters,
  tagAttributes,
  legendTag,
  annotationTags,
}) => {
  const config = {
    facetSection: (section) => {
      return facetSections.find( elt => elt.section === section );
    },
    facetSections,
    facetFilter: (tag, value) => {
      return facetFilters.find( elt => elt.tag === tag && elt.value === value );
    },
    facetFilters,
    tagAttribute: (tag, value) => {
      return tagAttributes.find( elt => elt.tag === tag &&
                                 (!value || elt.value === value) );
    },
    legendTag,
    annotationTags,
  };
  globalThis.config = config; //eslint-disable-line no-undef
  return config;
};

export const showCheckboxCount = 5;

export const types = {
  CATEGORY: 'category',
  ASSIGNMENT: 'assignment',
  INCLUSION: 'inclusion',
  CLASS: 'class',
  MULTIPLICITY: 'multiplicity',
};

export const defaultFacetSectionProps = {
  color: '#000000',
  checkBoxColorsOne: '#0d71a3',
  checkBoxColorsTwo: '#0d71a3',
  height: '5px',
  isExpanded: false,
};

export const defaultStyleAttributes = {
  node: {
    icon: categoryDefaultIcon,
    color: '#9B9B9B',
    background: '#691706',
  },
  table: {
    icon: categoryDefaultIcon,
  },
  legend: {
    icon: legendDefaultIcon,
  },
}

export const sortLabels = {
  sortAlphabetically: 'Sort alphabetically',
  sortByCount: 'Sort by counts',
  showMore: '...expand to see all selections',
};

export const resetIcon = {
  src: resetIconSVG,
  alt: 'Reset icon',
  size: '12 px',
};

export const controlVocabConfig = {
  maxNoOfItems: 10,
  maxNoOfItemDlgBox: 30,
};

export const filterConfig = {
//  facetFilters,
//  facetSectionProps,
  resetIcon,
  showCheckboxCount,
};

export const graphViewConfig = {
  legend: {
  },
  canvas: {
    fit: {
      x: 0,
      y: 20,
      zoom: 0.7,
      minZoom: 0.1,
      maxZoom: 2,
    },
  },
};
