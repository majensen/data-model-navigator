import React, { useContext } from "react";
import { withStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  getPropertyNameFragment,
  getPropertyDescriptionFragment,
  getPropertyTypeFragment,
} from "../../../Utils/highlightHelper";
import ListComponent from "./ListComponent";
import ButtonComponent from "./ButtonComponent";
import KeyIconSvg from "../../../../assets/key_icon.svg";
import { ConfigContext } from '../../../../Config/ConfigContext';
import { controlVocabConfig as ctrlConfig } from "../../../../Config/nav.config";
import "../DataDictionaryPropertyTable.css";
// import DownloadFileTypeBtn from "./DownloadFileTypeBtn";

const TableRows = ({
  classes,
  onlyShowMatchedProperties,
  matchedPropertiesSummary,
  properties,
  needHighlightSearchResult,
  hideIsRequired,
  openBoxHandler,
  isSearchMode,
  title,
}) => {

  const config = useContext( ConfigContext );
  const required = (requiredFlag, preferredFlag) => (
    <span className={requiredFlag ? classes.required : ""}>
      {requiredFlag ? "Required" : preferredFlag ? "Preferred" : "Optional"}
    </span>
  );

  const displayKeyProperty = (propertyFragment) => (
    <div className={classes.keyProperty}>
      {propertyFragment}
      <img
        src={KeyIconSvg}
        className={classes.keyPropertyIcon}
        alt="key-icon"
      />
    </div>
  );

  const displayKeyPropsDescription = (description) => {
    const lines = description.split("<br>");
    return (
      <div>
        {lines.map((line) => (
          <span>{line}</span>
        ))}
      </div>
    );
  };

  let rowList =  properties.map((prop) => {
    let nameMatch = null;
    let descriptionMatch = null;
    let typeMatchList = null;
    if (needHighlightSearchResult && matchedPropertiesSummary.length > 0) {
      const matchedSummaryItem = matchedPropertiesSummary.find(
        (item) => item.propertyKey === prop.handle
      );
      if (matchedSummaryItem) {
        nameMatch = matchedSummaryItem.nameMatch;
        descriptionMatch = matchedSummaryItem.descriptionMatch;
        typeMatchList = matchedSummaryItem.typeMatchList;
      } else if (onlyShowMatchedProperties) {
        return null;
      }
    }
    let type = prop.type;
    let enums = prop.type === 'value_set' ? prop.valueSet() : [];
    let key = prop.is_key;

    const isRequired = prop.tags('inclusion') === 'required';
    const isPreferred = prop.tags('inclusion') === 'preferred';

    const propertyNameFragment = getPropertyNameFragment(
      prop,
      nameMatch,
      "data-dictionary-property-table__span"
    );
    
    const propertyDescriptionFragment = getPropertyDescriptionFragment(
      prop,
      descriptionMatch,
      "data-dictionary-property-table__span"
    );
    
    const propertyTypeFragment = getPropertyTypeFragment(
      prop,
      typeMatchList,
      "data-dictionary-property-table__span"
    );
    
    return (
      <tr key={prop.handle} className={classes.row}>
        <td className={classes.rowItem}>
          {key
           ? displayKeyProperty(propertyNameFragment)
           : propertyNameFragment}
        </td>
        <td className={classes.rowItem}>
          {(enums && enums.length > 0) ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>
                <p className={classes.acceptValue}>Acceptable Values:</p>{" "}
                {enums.length > ctrlConfig.maxNoOfItems ? (
                  <ListComponent
                    enums={enums.slice(0, ctrlConfig.maxNoOfItems)}
                    isSearchMode={isSearchMode}
                    typeMatchList={typeMatchList}
                  />
                ) : (
                  <ListComponent
                    enums={enums}
                    isSearchMode={isSearchMode}
                    typeMatchList={typeMatchList}
                  />
                )}
              </span>
              {enums.length > ctrlConfig.maxNoOfItems && (
                <ButtonComponent
                  label="...show more"
                  openHandler={() =>
                    openBoxHandler(enums, typeMatchList, prop.handle)
                  }
                />
              )}
              {/* <DownloadFileTypeBtn
                data={enums}
                node={title}
                propertyKey={propertyKey}
                /> */}
            </div>
          ) : (
            <>
              {isSearchMode ? (
                <>{propertyTypeFragment}</>
              ) : (
                <>{JSON.stringify(type)}</>
              )}
            </>
          )}
        </td>
        {!hideIsRequired && (
          <td className={classes.rowItem}>
            {required(isRequired, isPreferred)}
          </td>
        )}
        <td className={classes.rowItem}>
          {key && !isSearchMode ? (
            <div className={classes.description}>
              {displayKeyPropsDescription(prop.desc)}
              {prop.tags('Labeled') && (
                <div className={classes.labeled}>
                  <span className={classes.labeledSpan}>DISPLAYED AS:</span>{" "}
                  {prop.tags('Labeled')}
                </div>
              )}
            </div>
          ) : (
            <div>
              {propertyDescriptionFragment}
              {prop.tags('Labeled') && (
                <div className={classes.labeled}>
                  <span className={classes.labeledSpan}>DISPLAYED AS:</span>{" "}
                  {prop.tags('Labeled')}
                </div>
              )}
            </div>
          )}
        </td>
      {/* <td className={classes.rowItem}>
          <p>{JSON.stringify(termID)}</p>
          </td> */}
      </tr>
    );
  });
  
  return (
    <>
      {rowList}
    </>
  );
};

const styles = () => ({
  rowItem: {
    padding: "10px 10px 10px 19px",
    "& p": {
      margin: "auto",
    },
    "&:nth-child(2)": {
      maxWidth: "300px",
      minWidth: "100px",
      wordWrap: "break-word",
    },
    "& span": {
      "&:last-child:not(:first-child)": {
        display: "block",
        marginTop: "13px",
      },
    },
  },
  labeledSpan: {
    fontWeight: "600",
  },
  labeled: {
    marginTop: "2em",
  },
  row: {
    padding: "10px 10px 10px 19px",
    border: "0",
    textAlign: "left",
    fontFamily: "Raleway",
    verticalAlign: "top",
    "& p": {
      margin: "auto",
    },
    "&:nth-child(2) > p": {
      maxWidth: "300px",
      minWidth: "100px",
      wordWrap: "break-word",
    },
    "&:nth-child(odd)": {
      background: "#fff",
    },
    "&:nth-child(even)": {
      background: "#f4f5f5",
    },
  },
  required: {
    color: "#8D432A",
    fontSize: "13px",
    fontWeight: "900",
  },
  keyProperty: {
    display: "inline-block",
    minWidth: "220px",
    fontWeight: "700",
    color: "#0d71a3",
    "& p": {
      float: "left",
      margin: "auto",
    },
  },
  acceptValue: {
    margin: "0",
    minWidth: "130px",
  },
  keyPropertyIcon: {
    width: "25px",
    marginLeft: "8px",
    paddingTop: "5px",
  },
  description: {
    "& span": {
      "&:last-child:not(:first-child)": {
        display: "block",
        marginTop: "13px",
      },
    },
  },
});

export default withStyles(styles)(TableRows);
