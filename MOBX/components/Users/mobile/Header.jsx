import { withStyles } from "@material-ui/core/styles";

import { headerStyles as styles } from "styles";

const Header = ({ classes, tableData, fullName }) => {
  return (
    <div className={classes.header}>
      <span className="idx">{tableData.id + 1}</span>
      <p>{fullName}</p>
    </div>
  );
};

export default withStyles(styles)(Header);
