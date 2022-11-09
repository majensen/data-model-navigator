import React from 'react';
import PropTypes from 'prop-types';
import { capitalizeFirstLetter } from '../../../utils';
import { getLegendCategoryIconSVG, getCategoryColor } from '../../NodeCategories/helper';
import './Legend.css';
import relationshipSvg from '../../NodeCategories/icons/Legend/lg_relationship_links.svg';

class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
  }

  toggleLegend = () => {
    this.setState(state => ({
      show: !state.show,
    }));
  }

  render() {
    return (
      <div className={`data-dictionary-graph-legend ${this.state.show ? '' : 'data-dictionary-graph-legend--toggled'}`}>
        {
          this.state.show ?
            (
              <React.Fragment>
                <i
                  className='data-dictionary-graph-legend__close g3-icon g3-icon--cross'
                  onClick={this.toggleLegend}
                  onKeyPress={this.toggleLegend}
                  role='button'
                  tabIndex={0}
                />
                <div className="data-dictionary-graph-legend__item body">
                  {/* <i className="data-dictionary-graph-legend__required-icon data-dictionary-graph-legend__required-icon g3-icon g3-icon--minus" /> */}
                  <img src={relationshipSvg} alt="relation" />
                  <span className="data-dictionary-graph-legend__text">Relationships</span>
                </div>
                {
                  this.props.items.map((category) => {
                    const itemColor = getCategoryColor(category);
                    // console.log(category);
                    const IconSvg = getLegendCategoryIconSVG(category);
                    return (
                      <div
                        key={category}
                        className='data-dictionary-graph-legend__item body'
                      >
                        <span className='data-dictionary-graph-legend__circle-wrapper'>
                          {
                            IconSvg ? <IconSvg /> : (
                              <span
                                className='data-dictionary-graph-legend__circle'
                                style={{ backgroundColor: itemColor }}
                              />
                            )
                          }
                        </span>
                        <span className='data-dictionary-graph-legend__text'>{capitalizeFirstLetter(category)}</span>
                      </div>
                    );
                  })
                }
              </React.Fragment>
            )
            : (
              <span
                className='data-dictionary-graph-legend__info'
                onClick={this.toggleLegend}
                onKeyPress={this.toggleLegend}
                role='button'
                tabIndex={0}
              >
                <i className='data-dictionary-graph-legend__info-icon g3-icon g3-icon--question-mark' />
              </span>
            )
        }
      </div>
    );
  }
}

Legend.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
};

Legend.defaultProps = {
  items: [],
};

export default Legend;
