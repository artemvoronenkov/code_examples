import { withStyles } from "@material-ui/core/styles";

import { cellStyles as styles } from "styles";

const Cell = ({ classes, text, icon = null }) =>
  text && (
    <div className={classes.cell}>
      <span className={classes.icon}>{icon}</span>
      <span>{text}</span>
    </div>
  );

export default withStyles(styles)(Cell);
