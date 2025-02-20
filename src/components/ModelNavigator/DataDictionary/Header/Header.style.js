export default function headerStyle() {
  return {
  titleContainer: {
    height: "85px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: "27px",
    paddingRight: "38px",
    paddingTop: "21px",
    marginBottom: "13px",
  },
  logoAndTitle: {
    display: "flex",
    gap: "13px",
  },
  brandIcon: {
    height: "85px",
    width: "85px",
    border: "0px",
    zIndex: "2",
  },
  titleAndVersion: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    color: "#083A50",
    fontSize: "25px",
    fontWeight: "bold",
    letterSpacing: "1px",
    fontFamily: "Nunito, Lato, sans-serif",
    marginBottom: "0px",
  },
  titleWithVersion: {
    marginTop: "12px",
  },
  modelVersion: {
    color: "rgba(87, 87, 87, 0.9)",
    fontSize: "12px",
    fontWeight: "400",
    letterSpacing: "0.5px",
    fontFamily: "Nunito Sans, Lato, sans-serif",
    textTransform: "uppercase",
    marginLeft: "2px",
  },
  btnGroup: {
    display: "flex",
    gap: "15px",
  },
  divider: {
    position: "relative",
    bottom: "13px",
    zIndex: "1",
    borderColor: "#686F7F",
    height: "3px",
    backgroundColor: "#686F7F",
  },
  readMeBtnRoot: {
    height: "38px",
    width: "137px",
    background: "#0F4C91",
    borderRadius: "5px",
  },
  readMeBtnLabel: {
    color: "#FFF",
    fontFamily: "Lato",
    fontSize: "16px",
    lineHeight: "22px",
  },
  };
}

