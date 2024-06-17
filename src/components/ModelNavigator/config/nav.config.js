export const categories = [
  'Adminstrative', 'Study', 'Clinical Trial',
  'Case', 'Biospecimen', 'Clinical',
  'Analysis', 'Data File'];

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

export const sortLabels = {
  sortAlphabetically: 'Sort alphabetically',
  sortByCount: 'Sort by counts',
  showMore: '...expand to see all selections',
};

export const facetFilters = [
  {
    groupName: 'Category',
    datafield: 'category',
    section: 'Filter By Nodes',
    tooltip: 'category',
    type: {entity: 'node', tag: 'Category'},
    show: true,
    checkboxItems: [
      { name: 'Administrative', tag: 'Category', value: 'administrative', isChecked: false, group: 'category' },
      { name: 'Analysis', tag: 'Category', value: 'analysis', isChecked: false, group: 'category' },
      { name: 'Biospecimen', tag: 'Category', value: 'biospecimen', isChecked: false, group: 'category' },
      { name: 'Case', tag: 'Category', value: 'case', isChecked: false, group: 'category' },
      { name: 'Clinical', tag: 'Category', value: 'clinical', isChecked: false, group: 'category' },
      { name: 'Clinical_Trial', tag: 'Category', value: 'clinical_trial', isChecked: false, group: 'category' },
      { name: 'Data_File', tag: 'Category', value: 'data_file', isChecked: false, group: 'category' },
      { name: 'Study', tag: 'Category', value: 'study', isChecked: false, group: 'category' },
    ],
  },
  {
    groupName: 'Assignment',
    datafield: 'assignment',
    section: 'Filter By Nodes',
    tooltip: 'assignment',
    type: {entity: 'node', tag: 'Assignment'},
    show: true,
    checkboxItems: [
      { name: 'Core', tag: 'Assignment', value: 'core', isChecked: false, group: 'assignment' },
      { name: 'Extended', tag: 'Assignment', value: 'extended', isChecked: false, group: 'assignment' },
    ],
  },
  {
    groupName: 'Class',
    datafield: 'class',
    section: 'Filter By Nodes',
    tooltip: 'class',
    type: { entity: 'node', tag: 'Class' },
    show: true,
    checkboxItems: [
      { name: 'Primary', tag: 'Class', value: 'primary', isChecked: false, group: 'class' },
      { name: 'Secondary', tag: 'Class', value: 'secondary', isChecked: false, group: 'class' },
    ],
  },
  {
    groupName: 'Inclusion',
    datafield: 'inclusion',
    section: 'Filter By Property',
    tooltip: 'inclusion',
    type: {entity: 'prop', tag: 'Inclusion'},
    show: true,
    checkboxItems: [
      { name: 'Optional', tag: 'Inclusion', value: 'optional', isChecked: false, group: 'optional' },
      { name: 'Preferred', tag: 'Inclusion', value: 'preferred', isChecked: false, group: 'preferred' },
      { name: 'Required', tag: 'Inclusion', value: 'required', isChecked: false, group: 'required' },
    ],
  },
  {
    groupName: 'UI Display',
    datafield: 'uiDisplay',
    section: 'Filter By Property',
    tooltip: 'inclusion',
    type: {entity: 'prop', tag: 'UI Display' },
    show: true,
    checkboxItems: [
      { name: 'no', tag: 'UI Display', value: 'no', isChecked: false, group: 'no' },
      { name: 'yes', tag: 'UI Display', value: 'yes', isChecked: false, group: 'yes' },
    ],
  },
];

export const facetSectionProps = {
  'Filter By Nodes': {
    color: '#0D71A3',
    checkBoxColorsOne: '#E3F4FD',
    checkBoxColorsTwo: '#0d71a3',
    checkBoxBorderColor: '#0D71A3',
    height: '7px',
    isExpanded: true,
  },
  'Filter By Relationship': {
    color: '#FF9742',
    checkBoxColorsOne: '#FF9742',
    checkBoxColorsTwo: '#FF9742',
    height: '7px',
    isExpanded: true,
  },
  'Filter By Property': {
    color: '#94C0EC',
    checkBoxColorsOne: '#E3F4FD',
    checkBoxColorsTwo: '#0d71a3',
    checkBoxBorderColor: '#0D71A3',
    height: '7px',
    isExpanded: true,
  },
};

export const resetIcon = {
  src: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/bento/images/icons/svgs/Clear-icon.svg',
  alt: 'Reset icon',
  size: '12 px',
};

export const baseFilters = {
  category: [],
  assignment: [],
  class: [],
  multiplicity: [],
  inclusion: [],
  uiDisplay: [],
};

export const filterSections = [
  'category',
  'assignment',
  'class',
  'inclusion',
  'display',
  'uiDisplay',
];

export const filterOptions = [
  // category
  'administrative',
  'case',
  'study',
  'clinical',
  'clinical_trial',
  'biospecimen',
  'analysis',
  'data_file',
  // Assignment
  'core',
  'extended',
  // Class
  'primary',
  'secondary',
  // Inclusion
  'required',
  'preferred',
  'optional',
  // 'uiDisplay',
  'yes',
  'no',
];

export const controlVocabConfig = {
  maxNoOfItems: 10,
  maxNoOfItemDlgBox: 30,
};

export const filterConfig = {
  facetFilters,
  facetSectionProps,
  resetIcon,
  baseFilters,
  filterSections,
  filterOptions,
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
