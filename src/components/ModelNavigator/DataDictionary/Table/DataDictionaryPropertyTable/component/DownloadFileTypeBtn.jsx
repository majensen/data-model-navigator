import React, { useState } from "react";
import { createTheme, ThemeProvider, StyledEngineProvider, Box } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import ButtonGroup from "@mui/material/ButtonGroup";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuItem from "@mui/material/MenuItem";
import ForwardIcon from "@mui/icons-material/Forward";
import { saveAs } from "file-saver";
import { capitalizeFirstLetter, createFileName } from "../../../utils";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useSelector } from 'react-redux';

const pdfConfig = {}; // stub

const DOWNLOADS = "DOWNLOADS";
const filePrefix = "Controlled_Vocabulary-";
const FILE_TYPE_JSON = "JSON";
const CONTENT_TYPE_JSON = "application/json";
const CONTENT_TYPE_TSV = "data:text/tab-separated-values";
const FILE_TYPE_TSV = "TSV";
const fileTypes = [FILE_TYPE_JSON, FILE_TYPE_TSV];

const StyledMenu = withStyles({
  paper: {
    border: "2px solid #0D71A3",
    width: "110px",
    borderBottomRightRadius: "5px !important",
    borderBottomLeftRadius: "5px !important",
    borderRadius: "0px",
  },
  list: {
    padding: 0,
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: "none",
      "& .MuiListItemIcon-root": {
        backgroundColor: "none",
      },
    },
    "&:hover": {
      backgroundColor: "#e1f0f7",
    },
  },
}))(MenuItem);

const DownloadFileTypeBtn = ({ classes, data, node:node_handle, propertyKey }) => {
  const [anchorElement, setAnchorElement] = useState(null);
  const [label, setLabel] = useState("DOWNLOADS");

  const clickHandler = (event) => {
    setLabel("DOWNLOADS");
    setAnchorElement(event.currentTarget);
  };

  const closeHandler = () => {
    setAnchorElement(null);
  };

  const setFileType = (value) => {
    setLabel(value);
    setAnchorElement(null);
  };

  const download = (thisData, fileType, contentType) => {
    const exportData = new Blob([thisData], { type: contentType });
    const nodeTitle = capitalizeFirstLetter(node_handle);
    const fileName = createFileName(`${nodeTitle}-${propertyKey}`, pdfConfig?.downloadPrefix || filePrefix);
    saveAs(exportData, `${fileName}.${fileType.toLowerCase()}`);
  };

  const downloadFile = () => {
    if (label === FILE_TYPE_JSON) {
      const jsonData = JSON.stringify(data);
      download(jsonData, FILE_TYPE_JSON, CONTENT_TYPE_JSON);
    }
    if (label === FILE_TYPE_TSV) {
      let content = "";
      if (data && data.length) {
        data.forEach((item, index) => {
          content += index === 0 ? item : `${"\n"}${item}`;
        });
      }
      download(content, FILE_TYPE_TSV, CONTENT_TYPE_TSV);
    }
  };

  const menuItem = (type) => (
    <StyledMenuItem
      className={classes.menuItem}
      onClick={() => setFileType(type)}
    >
      {type}
    </StyledMenuItem>
  );

  const options = fileTypes.map((item) => menuItem(item));

  return (
    <>
      <ButtonGroup variant="contained" classes={{ root: classes.btnGrpRoot }}>
        <Button
          classes={{
            root: classes.downloadDropdownBtn,
            label: classes.downloadDropdownBtnLabel,
          }}
          onClick={clickHandler}
        >
          <div className={classes.downloadDropdownIconLabelContainer}>
            <KeyboardArrowDownIcon />
            {label}
          </div>
        </Button>

        <Button
          disabled={DOWNLOADS === label}
          onClick={downloadFile}
          classes={{
            root: classes.downloadBtn,
          }}
        >
          <ArrowDownwardIcon
            classes={{
              root: classes.downloadBtnIcon,
            }}
          />
        </Button>
      </ButtonGroup>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorElement}
        keepMounted
        open={Boolean(anchorElement)}
        onClose={closeHandler}
      >
        {options}
      </StyledMenu>
    </>
  );
};

const styles = () => ({
  btnGrpRoot: {
    border: "1px solid #0D71A3",
    backgroundColor: "#0D71A3",
    boxShadow: "none",
    height: "27px",
    maxWidth: "fit-content",
  },
  downloadDropdownIconLabelContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  downloadDropdownBtnContained: {},
  downloadDropdownBtn: {
    backgroundColor: "#F2F1F1",
    width: "110px",
  },
  downloadDropdownBtnLabel: {
    color: "#0D71A3",
    fontSize: "11px",
    fontFamily: "Lato",
    fontWeight: "bold",
  },
  downloadBtn: {
    backgroundColor: "#376FA0",
    width: "27px",
    minWidth: "27px",
    color: "white",
    "&:disabled": {
      backgroundColor: "#376FA0",
    },
    "&:hover": {
      backgroundColor: "#376FA0",
    },
  },
  downloadBtnIcon: {
    color: "#FFF",
  },
  menu: {
    border: "1px solid #0D71A3",
    boxSizing: "border-box",
    backgroundColor: "#0D71A3",
    borderRadius: "5px",
    float: "left",
  },
  displayBtn: {
    width: "102px",
    height: "2em",
    boxSizing: "border-box",
    color: "#0d71a3",
    backgroundColor: "#F2F1F1",
    textTransform: "none",
    padding: "7px",
    marginRight: "0",
    float: "left",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#F2F1F1",
    },
  },
  dropDownText: {
    lineHeight: "1.05",
    fontSize: "10px",
    fontFamily: "Open Sans",
    fontWeight: "600",
    color: "#0d71a3",
    textAlign: "left",
    position: "relative",
  },
  arrowDownward: {
    fontSize: "30px",
    color: "#DC762F",
  },
  menuItem: {
    fontSize: "10px",
    fontWeight: "bold",
    paddingLeft: "22px",
    fontFamily: "Lato",
    color: "#0d71a3",
    "&:last-child": {
      backgroundColor: "#CBE2EE",
      "&:hover": {
        backgroundColor: "#e1f0f7",
      },
    },
  },
  // downloadBtn: {
  //   float: 'right',
  //   marginBottom: '-20px',
  //   height: '27px',
  //   width: '27px',
  //   backgroundColor: '#0D71A3',
  //   borderRadius: '0px',
  //   paddingLeft: '8px',
  //   '&:hover': {
  //     backgroundColor: '#0D71A3',
  //   },
  // },
  downloadIcon: {
    color: "#fff",
    fontSize: "18px",
  },
});

export default withStyles(styles, { withTheme: true })(DownloadFileTypeBtn);
