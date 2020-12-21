import { memo } from "react";
import { withStyles } from "@material-ui/core/styles";

import Header from "./Header";
import DetailsPanel from "./DetailsPanel";

import { userTableCardStyles as styles } from "styles";

const TableCard = ({
  classes,
  handleDelete,
  info: {
    tableData,
    fullName,
    userId,
    emailAddress,
    extension,
    phoneNumber,
    departmentName,
  },
}) => (
  <div className={classes.wrapper}>
    <Header tableData={tableData} fullName={fullName} />
    <DetailsPanel
      classes={classes}
      handleDelete={handleDelete}
      userId={userId}
      fullName={fullName}
      emailAddress={emailAddress}
      extension={extension}
      phoneNumber={phoneNumber}
      departmentName={departmentName}
    />
  </div>
);

const comparator = (prev, current) => prev.info.userId === current.info.userId;

export default memo(withStyles(styles)(TableCard), comparator);
